/**
 * Created By  : Priyadarsini T B
 * Description : This View Model is to show all the admin modules in one page 
 * History     : 24-APR-2020 - Created Initial Model
 */
define(['accUtils', 'knockout', 'appController', 'restModule', 'ojs/ojmodule-element-utils', 'signals'
    ,'ojs/ojarraydataprovider', 'ojs/ojnavigationlist', 'ojs/ojswitcher', 'ojs/ojradioset', 'ojs/ojchart'
    , 'ojs/ojslider', 'ojs/ojconveyorbelt','ojs/ojprogress'],
  function (accUtils, ko, app, RestModule, moduleUtils, signals, ArrayDataProvider) {

    function SurveyViewModel() {
      var self = this;
      /**Variables */
      var chartLoadSignal = new signals.Signal();
      self.survydata = ko.observableArray([]);
      self.tabData = new ArrayDataProvider(self.survydata, { keyAttributes: 'comp_name' });
      var ansData = [{ value: 1, label: "Aware" }, { value: 2, label: "Developing" }, { value: 3, label: "Practicing" }, { value: 4, label: "Optimizing" }, { value: 5, label: "Leading" }];
      self._ans_DP = new ArrayDataProvider(ansData, { keyAttributes: 'value' });
      self.selectedCmptncy = ko.observable();
      self.indDomainCrumb = ko.observable("Retails > Finance");
      self.selectedPnPnts = ko.observable();
      self.selectedQuestions = function (context) {
        return context.questions;
      };
      self.submitSurvy = () => {
        let maturityScores = populatePostSurvyData();
        showSbmtPrgrs();
        var postScoreSrvc = { url: RestModule.API_URL.storeQuestns, method: "POST", data: JSON.stringify(maturityScores )};        
        RestModule.callRestAPI(postScoreSrvc, function (response) {          
            /**Post suceeded */
            let survyDataOfClnt = {};
            chartLoadSignal.dispatch(self.survydata());
            hideSbmtPrgrs();             
            document.getElementById('survyQues').classList.toggle('demo-page1-hide');
            document.getElementById('polarChrt').classList.toggle('demo-page2-hide');  
                   
        }, function (failResponse) {          
          hideSbmtPrgrs();
          /**Post failed */
        });
      }
      self.backToSurvy = () => {
        document.getElementById('survyQues').classList.toggle('demo-page1-hide');
        document.getElementById('polarChrt').classList.toggle('demo-page2-hide');
      }
      var populatePostSurvyData = () => {
        let maturityScores = { maturityScores: [] };
        let cptncyAvgs = {maturityLevel:[]};
        $.each(self.survydata(), function (idx, cmptncy) {
          $.each(cmptncy.questions, function (qsIdx, questn) {
            let _pData = new PostSurvyData(questn);
            maturityScores.maturityScores.push(_pData);
          });
          cptncyAvgs.maturityLevel.push({ cmpt : cmptncy.comp_id,avScore : cmptncy.avg()});
        });
        cptncyAvgs.subject = app.loggedInClient();
        cptncyAvgs.ind = app.selectedIndustryCode();
        cptncyAvgs.dom = app.selectedDomainCode();
        cptncyAvgs.updated_by = app.userLogin();
        maturityScores.summary = cptncyAvgs;
        return maturityScores;
      }

      function PostSurvyData(item) {
        this.qstnScore = {
          qrec_id: item.quest_id,
          score: item.scr(),
          score_id: item.score_id,
          subject: app.loggedInClient(),
          flag: item.flag,
          crtd_by: app.userLogin(),
          updated_by: app.userLogin()
        };
      }
      /**Fetch and Load the Survey questions from Service */
      var loadSurvyQstns = () => {
        showPrgrs();
        var survySerive = { url: RestModule.API_URL.selfAssesmnt, method: "GET", data: {} };
        survySerive.parameters = {};
        survySerive.headers = { DOM_CODE_FK: app.selectedDomainCode(), IND_CODE_FK: app.selectedIndustryCode(), CLIENT_NAME: app.loggedInClient() };
        RestModule.callRestAPI(survySerive, function (response) {
          if (response.items && response.items != null) {
            constructSurvyData(response.items);
            hidePrgrs();
          } else {
            hidePrgrs();
          }
        }, function (failResponse) {          
          hidePrgrs();
        });
      };
      /**Construct the questions data with answer obervables */
      var constructSurvyData = (survy_data) => {
        /* let pnpnts = self.selectedPnPnts() ? (self.selectedPnPnts()[app.selectedIndustryCode()][app.selectedDomainCode()] != undefined ? self.selectedPnPnts()[app.selectedIndustryCode()][app.selectedDomainCode()] : []) : [];
        pnpnts = pnpnts ? pnpnts.selected_pp : []; */
        let pnpnts = self.selectedPnPnts() ? self.selectedPnPnts() : [];        
        $.each(survy_data, function (idx, cmptncy) {
          $.each(cmptncy.questions, function (qsIdx, questn) {
            questn.flag = (questn.scr == undefined) ? "CREATE" : "UPDATE";
            questn.score_id = (questn.scr == undefined) ? "" : questn.score_id;
            questn.scr = (questn.scr == undefined || questn.scr == 0) ? ko.observable(2) : ko.observable(questn.scr);
            questn.hglghtPnPnt = false;
            if(questn.pp_rcrd_id != undefined) {
              let _pp = questn.pp_rcrd_id.split(',');
              if(_pp.length > 0){
                $.each(pnpnts,function(idx,val){
                  if(_pp.includes(val))
                    questn.hglghtPnPnt = true;
                });
              }
            }
          });
          cmptncy.avg = ko.computed(function () {
            let _ttl = 0;
            let validQuesCnt = 0;
            $.each(cmptncy.questions, function (qsIdx, questn) {
              if (questn.scr() != 0) { /*If score in a row is 0 we will not consider it to average */
                _ttl += questn.scr();
                validQuesCnt++;
              }
            });
            let _avg = _ttl == 0 ? _ttl : _ttl / validQuesCnt;
            return _avg == 0 ? 0 : _avg.toFixed(1);
          });
        });
        self.survydata(survy_data);
        if (survy_data.length > 0)
          self.selectedCmptncy(survy_data[0].comp_name);
      }
      /**Capture answer cell click */
      self.selectAns = function (evt, context, cell) {
        /**As this is a bind method with custom params, on load also this will be called, 
         * so we have to include a chck to capture click event type */
        if (evt && evt.type == "click") {
          context.scr(context.scr() == cell ? 0 : cell);
        }
      }
      /**Go to data grid Intelligent Workflows tab */
      self.gotoIntlgntWrkflw = () =>{
        app.frmScreen("survy-intlgnt");
        app.router.go("dataGrid");
      }
      /**Chart View Model - START */
      self.chartViewModule = ko.computed(function () {
        return moduleUtils.createConfig({
          viewPath: "views/survyChart.html", viewModelPath: "viewModels/survyChart", params: { 'chartLoadSignal': chartLoadSignal ,legendHorzntl:true}
        });
      });      
      /**Chart View model - END */

      /**Show/Hide progress - START*/
      var showPrgrs = () => {
        $("#srvyQuesPrgrs").css("display","block");
      }
      var hidePrgrs = () => {
        $("#srvyQuesPrgrs").css("display","none");
      }
      var showSbmtPrgrs = () => {
        $("#srvySbmtPrgrs").css("display","block");
      }
      var hideSbmtPrgrs = () => {
        $("#srvySbmtPrgrs").css("display","none");
      }
      /**Show/Hide progress - END */
      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function () {
        document.title = "CBM-Self-Survey";
        accUtils.announce('Execution page loaded.', 'assertive');
        app.updateCntrlrObjsFrmSession();/*to update the common parameters from session*/
        self.selectedPnPnts(getPainPointsSltdIds(app.selectedIndustryCode(), app.selectedDomainCode()));
        self.indDomainCrumb(app.selectedIndustryTxt() + ' > ' + app.selectedDomainTxt());
        loadSurvyQstns();

      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
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
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return SurveyViewModel;
  }
);
