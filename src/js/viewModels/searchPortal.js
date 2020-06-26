/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery','appController', 'ojs/ojarraydataprovider', 'restModule', 'ojs/ojmodel', 'ojs/ojknockout', 'ojs/ojselectcombobox', 'ojs/ojbutton', 'ojs/ojvalidationgroup','ojs/ojprogress'],
  function (oj, ko, $, app, ArrayDataProvider, restModule) {

    function SearchPortalViewModel() {
      var self = this;
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      // ----------------------------- Dropdown dynamic alignment starts -----------
      // can be made static later and removed
      self.processLstDisable= ko.observable(true);
      self.bpPrgrs = ko.observable(-1);
      self.bpPrgrsVisible = ko.observable(false);
      self.selectedIndustryTxt = ko.observable({});
      self.selectedDomainTxt = ko.observable({});
      this.flex = ko.observable("oj-sm-flex-items-1");
      this.justify = ko.observable("oj-sm-justify-content-center");
      this.align = ko.observable("oj-sm-align-items-center");
      this.width = ko.observable(["demo-min-width-panel"]); //
      this.webkitbug = ko.observable(["demo-webkit-bug-136041"]);

      this.webkitbugdisabled = ko.computed(function () {
        return !((this.flex() == "oj-sm-flex-items-1" ||
            this.flex() == "oj-sm-flex-items-0") &&
          this.width().includes("demo-min-width-panel"));
      }.bind(this));


      this.classes = ko.computed(function () {
        var webkitbugclass = this.webkitbugdisabled() ? "" : this.webkitbug().join(" ");

        return this.flex() + " " + this.justify() + " " +
          this.align() + ' ' + this.width().join(" ") +
          ' ' + webkitbugclass;
      }.bind(this));
      // ----------------------------- Dropdown dynamic alignment ends -----------


      //---------validation handler
      self.groupValid = ko.observable();
      self.industryCheck = ko.observable();
      self.processCheck = ko.observable();

      self.industryCheck = {
        validate: function (value) {
          //console.log(value);
          if (!value) {
            return false;
          }
          return true;
        }
      };

      self.processCheck = {
        validate: function (value) {
          //console.log(value);
          if (!value) {
            return false;
          }
          return true;
        }
      };
      self.goToSurvey = () =>{
        if(proceed()){          
          oj.Router.rootInstance.go('survey');
          return true;
        }           
      };
      //-----------button handler code begins------
      this.applyButton = "Proceed";
      this.applyButtonClick = function (event) {

        //validation...
          if(proceed()){
            app.frmScreen("searchPortal");
            oj.Router.rootInstance.go('dataGrid');
            return true;
          }     
            
      }.bind(this);
      var proceed = () =>{
        document.getElementById("industry").validate();
        document.getElementById("process").validate();
        
        var tracker = document.getElementById("tracker");
        if (tracker.valid === "valid")
        {
        app.selectedDomainCode(self.processVal());
          app.selectedIndustryCode(self.industryVal());

          app.selectedDomain(document.getElementById('process').value);
          app.selectedIndustryTxt(self.selectedIndustryTxt());
          app.selectedDomainTxt(self.selectedDomainTxt());    
          self.processOptionsDP().fetchByKeys(
            {keys:[self.processVal()]}
            ).then(function(row) {              
              let _selectedProcsdata = row.results.get(self.processVal()).data;
              let _bwl = _selectedProcsdata.bwl_link;
              let _localLnk = _selectedProcsdata.local_link;              
              app.selectedBWL(_bwl);
              if(_localLnk != "N/A"){
                app.localizationLnk(_localLnk);
              }
              else
                app.localizationLnk("#");
              app.setCntrlrObjsInSession(); //Set all the selected attributes in session
            });
                      
          console.log("[searchPortal]: Selected Domain and Selected Industry codes have been set ----");
          console.log("[searchPortal]: selectedDomainCode="+app.selectedDomainCode());
          console.log("[searchPortal]: selectedIndustryCode="+app.selectedIndustryCode());
          console.log(self.selectedIndustryTxt());
          return true;
        }else{
          return false;
        }
      };
      //Disabling button
      this.disabledValue = ko.observableArray();
      this.disableControls = ko.computed(function () {
        return this.disabledValue()[0];
      }.bind(this));
      //-----------button handler code ends--------


      //-----------Industry Dropdown code begins---------
      self.industryVal = ko.observable("");
      self.industryOptionsDP = ko.observableArray([]);
      self.industryOptKeys = { value: "ind_code", label: "ind_value" };
      //-----------Industry Dropdown code ends---------

      //-----------Process Dropdown code begins---------
      self.processVal = ko.observable("");
      self.processOptionsDP = ko.observableArray([]);
      self.processOptKeys = { value: "dom_code", label: "dom_value" };
      //-----------Process Dropdown code ends-----------
 
    //------code addition for process list view begins---------------
    function showProcsProgress(){
      self.bpPrgrsVisible(true);
    }
    function hideProcsProgress(){
      self.bpPrgrsVisible(false);
    }
    self.loadProcessListData = function (ind_code) {     
      console.log("[searchPortal]::loadProcessListData begins");
      //console.log("[searchPortal]:: REST URI = "+restModule.API_URL.getDomains);

      var processService = {url: restModule.API_URL.getDomains, method: "GET", data: {}, parameters:{}, headers:{}};
      if(ind_code != null && ind_code != undefined)
        processService.headers = {INDUSTRY_VAR:ind_code};
      console.log(processService);
      //showProcsProgress();
      restModule.callRestAPI(processService, function (response) {
          //console.log("[searchPortal]:: Get Process List Success Response");
          if (response.items && response.items != null) {
            //console.log(response.items);
            self.processOptionsDP([]);
            self.processOptionsDP(new ArrayDataProvider(response.items, {keyAttributes: 'dom_code'}));
            self.processLstDisable(false);       
          } else {

          }
          //hideProcsProgress();
          }, function (failResponse) {
              var processServiceFailPrompt = "Get Process List Service failure";
              console.log(processServiceFailPrompt);
              console.log(failResponse);
             // hideProcsProgress();
              app.showMessages(null, 'error', processServiceFailPrompt);              
          });
      };
      //------code addition for process list view ends---------------
 
      //------code addition for industry list view begins---------------
      self.loadIndustryListData = function () {

        console.log("[searchPortal]::loadIndustryListData begins");
        //console.log("[searchPortal]:: REST URI = "+restModule.API_URL.getIndustries);

        var industryService = {url: restModule.API_URL.getIndustries, method: "GET", data: {}, parameters:{}, headers:{}};
        
        restModule.callRestAPI(industryService, function (response) {
            //console.log("[searchPortal]:: Get Industry List Success Response");
            if (response.items && response.items != null) {
              //console.log(response.items);
              self.industryOptionsDP([]);
              self.industryOptionsDP(new ArrayDataProvider(response.items, {keyAttributes: 'ind_code'}));
                      
            } else {

            }
            }, function (failResponse) {
                var industryServiceFailPrompt = "Get Industry List Service failure";
                console.log(industryServiceFailPrompt);
                console.log(failResponse);
                
                app.showMessages(null, 'error', industryServiceFailPrompt);
            });
        };
        //------code addition for industry list view ends---------------

        self.industryChangeHandler = function (event)
        {
          console.log('Industry change handler'+self.industryVal());
          app.selectedIndustryCode(self.industryVal());
          self.loadProcessListData(self.industryVal());
        }.bind(this);

        self.processChangeHandler = function (event)
        {
          console.log(self.processVal());
          app.selectedDomainCode(self.processVal());
        }.bind(this);

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function () {
        console.log("[searchPortal]: Inside Connected");
        //self.loadProcessListData();
        self.loadIndustryListData();
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
        console.log("[searchPortal]: Inside Disconnected");
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function () {
        // Implement if needed
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new SearchPortalViewModel();
  }
);