define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojmodel', 'ojs/ojkeyset', 'restModule', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojlistview', 'ojs/ojcollapsible', 'ojs/ojchart', 'ojs/ojtable',
  'ojs/ojswitcher', 'ojs/ojbutton', 'ojs/ojselectsingle', 'ojs/ojformlayout', 'ojs/ojselectcombobox'],
  function (oj, ko, $, app, Model, keySet, restModule, ArrayDataProvider) {
    /** This module will not return a new instance of it. Wherever this module is required, 
     * createViewModule can be used to instantiate it. This is loaded in dataGrid page*/
    return function LeadingPracticesViewModel() {
      var self = this;

      /** Progress Indicator*/
      self.ldngPrctcPrgrsVisible = ko.observable(false);

      /**Competency List */      
      self.competList = ko.observableArray([]);
      self.selCompetency = ko.observable('all');
      self.comptencyKeys = {
        label: 'competency_name',
        value: 'competency_code'
      };

      self.connected = function () {
        /**Load competency list */
        loadCompetency();
        /**Load leading practices */
        loadLeadingPractices("all");
      };

      var loadCompetency = function () {
        self.ldngPrctcPrgrsVisible(true);
        var cmptncySerive = { url: restModule.API_URL.getCompetencies, method: "GET", data: {} };
        cmptncySerive.parameters = {};
        cmptncySerive.headers = { DOMAIN_CODE_VAR: app.selectedDomainCode() };
        restModule.callRestAPI(cmptncySerive, function (response) {          
          if (response.items && response.items != null) {
            self.competList([]);
            let _l = [{ competency_code: "all", competency_name: "All" }];
            _l = _l.concat(response.items);
            self.competList(_l);            
            
          } else {

          }
          self.ldngPrctcPrgrsVisible(false);
        }, function (failResponse) {
          self.ldngPrctcPrgrsVisible(false);
          var cmptncyFailPrompt = "Competency List Service failure";
          console.log(failResponse);
          app.showMessages(null, 'error', cmptncyFailPrompt);
        });
      }
      /**Leading Practices Data */
      var data = {};
      self.ldngPrctcsData = ko.observableArray([]);

      /**Load leading Practices */
      function loadLeadingPractices(fltrComtncyCode) {
        self.ldngPrctcPrgrsVisible(true);
        var leadingPracticeService = { url: restModule.API_URL.viewLeadingPractices, method: "GET", data: {} };
        leadingPracticeService.parameters = {};
        leadingPracticeService.headers = { DOMAIN_CODE_VAR: app.selectedDomainCode() };
        if(fltrComtncyCode !== 'all'){
          leadingPracticeService.headers.COMPETENCY_CODE_VAR = fltrComtncyCode;
        }
        restModule.callRestAPI(leadingPracticeService, function (response) {
          if (response.items && response.items != null) {
            data.items = response.items;
            constructLeadingPrcticeData(data);
          } else {
            console.log("Empty response in leading practices service");
          }
          self.ldngPrctcPrgrsVisible(false);
        }, function (failResponse) {
          self.ldngPrctcPrgrsVisible(false);
          var lpServiceFailPrompt = "Lead Practice Service failure";
          console.log(failResponse);
          app.showMessages(null, 'error', lpServiceFailPrompt);
        });
      }
      /**Calculate Contruct leading practices data */
      function constructLeadingPrcticeData(data) {
        self.ldngPrctcsData([]);
        let ldngPrctcsDataTemp = [];
        /**For each competency and process */
        data.items.forEach((element) => {
          var cmptRow = {};
          var existingCompt = ko.utils.arrayFilter(ldngPrctcsDataTemp, function (item) {
            return (item.cmptid === element["cmptid"]);
          });
          let existing = true;
          if (existingCompt[0])
            cmptRow = existingCompt[0];
          else {
            existing = false;
            cmptRow = { cmptid: element["cmptid"], cmptname: element['cmptname'], cmptSpan: 0, process: [] };
          }
          let process = { name: element.process, values: [] };
          let maxSize = Math.max(element.aware.length, element.dvlp.length, element.prctc.length, element.optmz.length, element.lead.length);
          process.processSpan = maxSize;
          for (let i = 0; i < maxSize; i++) {
            let processVals = {
              aware: element.aware[i] ? element.aware[i].val : '',
              dvlp: element.dvlp[i] ? element.dvlp[i].val : '',
              prctc: element.prctc[i] ? element.prctc[i].val : '',
              optmz: element.optmz[i] ? element.optmz[i].val : '',
              lead: element.lead[i] ? element.lead[i].val : '',
              awareIsLast : false,dvlpIsLast: false, prctcIsLast:false, optmzIsLast:false, leadIsLast:false
            };
            if(i == element.aware.length-1){
              processVals.awareSpan = (maxSize - element.aware.length)+1 ; processVals.awareIsLast = true;}
            if(i == element.dvlp.length-1){
              processVals.dvlpSpan = (maxSize - element.dvlp.length)+1 ; processVals.dvlpIsLast = true;}
            if(i == element.prctc.length-1){
              processVals.prctcSpan = (maxSize - element.prctc.length)+1 ;processVals.prctcIsLast = true;}
            if(i == element.optmz.length-1){
              processVals.optmzSpan = (maxSize - element.optmz.length)+1 ;processVals.optmzIsLast = true;}
            if(i == element.lead.length-1){
              processVals.leadSpan = (maxSize - element.lead.length)+1 ;processVals.leadIsLast = true;}
            process.values.push(processVals);
          }
          
          cmptRow.process.push(process);
          cmptRow.cmptSpan = cmptRow.cmptSpan + process.processSpan;          
          if (!existing)
            ldngPrctcsDataTemp.push(cmptRow);
        });
        self.ldngPrctcsData(ldngPrctcsDataTemp);
      }

      this.cmptncyChanged = function (event) {
        console.log(event.detail.value);
        /**Load leading practices for a specific competency */        
        loadLeadingPractices(event.detail.value);
      }

    }
  });