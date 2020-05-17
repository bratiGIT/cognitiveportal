define(['ojs/ojcore', 'knockout', 'jquery', 'appController','ojs/ojmodel', 'ojs/ojcollectiondataprovider'
      ,'restModule','ojs/ojarraydataprovider','ojs/ojcollectiondataprovider','ojs/ojknockout','ojs/ojswitcher','ojs/ojlistview'],
  function (oj, ko, $, app, Model, CollectionDataProvider, restModule, ArrayDataProvider,CollectionDataProvider) {
     /** This module will not return a new instance of it. Wherever this module is required, 
      * createViewModule can be used to instantiate it. This is loaded in dataGrid page*/
     return function GridSidePanelViewModel(params) {         
      var self = this;      
      //Header Level tab addition code begins
      self.gridInfoBarSelectedItem = ko.observable("info");
      self.gridInfoBarCurrentEdge = ko.observable("top");
      self.ldngPrctcPrgrsVisible = ko.observable(false);
      self.setSelectedCurrency = ko.observable(getCurrentUserCurrency());
      self.bwl=ko.observable(app.selectedBWL());
      self.localizationUrl = ko.observable(app.localizationLnk());
      self.showLocalzn = ko.observable();
      self.showLocalzn(self.localizationUrl() != "#" ? true : false);
      self.indPainPointsData = ko.observable([]);      
      self.showIndpainPnts = ko.observable(false);
      self.indPainPntsDataProvider = ko.observable();

      //Header Level tab addition code ends

      self.closeLeadPractDialog = function (event) {
        document.getElementById('leadingPracticeDialog').close();
      }

      self.openLeadPractDialog = function (event) {
        //self.prepareLeadingPracticesData();
        document.getElementById('leadingPracticeDialog').open();
      }

      /* Org Chart Addition begins*/
      this.closeOrgChartDialog = function (event) {
        document.getElementById('orgChartDialog').close();
      }

      this.openOrgChartDialog = function (event) {
        //self.prepareLeadingPracticesData();
        document.getElementById('orgChartDialog').open();
      }
      /* Org Chart Addition ends*/

      /* Rapid move begins*/
      this.closeRapidMoveDialog = function (event) {
        document.getElementById('orgChartDialog').close();
      }
  
      self.selectPainPoint = function(evt,lineItem){
        let alreadyOpen = false;
        let evtTarget = evt.target.nodeName;
        if(evtTarget != "A"){
          ko.utils.arrayForEach(self.indPainPointsData(),function(item){          
            if(item.title === lineItem.data.title && lineItem.data.showDetl()){
              lineItem.data.showDetl(false);
              alreadyOpen = true;
            }
            item.showDetl(false);

          });
          if(!alreadyOpen)
          lineItem.data.showDetl(true);
        }
      };

      function constructIndPnPntData(items){        
        let _painPintsArr = [];
        ko.utils.arrayForEach(items,function(value){                    
          let painPoint = new IndPainPoint(value);
          _painPintsArr.push(painPoint);
        });
        self.indPainPointsData(_painPintsArr);
      }

      /**Pain Point Class */
      function IndPainPoint(painPoint){
        this.title = painPoint.title;
        this.desc = painPoint.dsc;
        this.showDetl = ko.observable(false);
        this.solutions= painPoint.soln;
      }

      self.indPainPntsCollSync = function (method, model, options) {
        console.log("[competencyDetails]::cmptncyKpiCollSync begins");
        var indPainPntsService = {url: restModule.API_URL.indPainPnts, method: "GET", data: {}};
        /*URL Parameters*/
        indPainPntsService.parameters = {};
        /*Header Parameters*/
        indPainPntsService.headers = {INDUSTRY_VAR: app.selectedIndustryCode(), DOM_CODE_VAR:app.selectedDomainCode() };
        restModule.callRestAPI(indPainPntsService, function (response) {
          console.log("[gridSidePanel]:: Industry Pain Points Success Response");
          if (response.items && response.items != null) {
            //console.log(response.items);
            constructIndPnPntData(response.items);            
            options["success"](self.indPainPointsData(), null, options);
          } else {
            options["success"](null, null, options);
          }
          }, function (failResponse) {
              var indPainPntsSrvcFailPrompt = "Industry Pain Points Service failure";
               ptions["error"](failResponse, null, options);
              app.showMessages(null, 'error', indPainPntsSrvcFailPrompt);
          });
        };
      this.connected= function(){
        console.log("Grid Side Panle connected--"+params.selectedTab);
        if(params.selectedTab && params.selectedTab === "indSpec"){
         self.showIndpainPnts(true);
         self.indpaintPntsSource.refresh();
        }
      }

      var indPainPointsModel = oj.Model.extend({
        idAttribute: 'title'
      });

      self.indPainPointsCollctn = oj.Collection.extend({
         model: indPainPointsModel
        ,comparator: "title"
        ,sync: self.indPainPntsCollSync
      });

      self.indpaintPntsSource = new self.indPainPointsCollctn();
      self.indPainPntsDataProvider(new CollectionDataProvider(self.indpaintPntsSource));      

    }
    
  });