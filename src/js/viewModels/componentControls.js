define(['ojs/ojcore', 'knockout', 'jquery', 'appController','ojs/ojmodel', 'ojs/ojarraydataprovider','ojs/ojcollectiondataprovider','restModule','ojs/ojknockout'
       ,'ojs/ojswitcher'],
  function (oj, ko, $, app, Model, ArrayDataProvider,CollectionDataProvider,restModule) {
     /** This module will not return a new instance of it. Wherever this module is required, 
      * createViewModule can be used to instantiate it. This is loaded in dataGrid page*/
     return function ComponentControlsViewModel(params) {         
      var self = this;

      console.log("[componentControls]:Begins");
      console.log(params);

      self.cntrlPrgrsVisible = ko.observable(false);
      self.waitProgress = ko.observable(-1);
      self.selectedBizCompId = ko.observable("");
      self.cntrlRgnDataProvider = ko.observable();
      self.cntrlCollection = null;

      //Set Module Params to local variables
      if (params.selectedBizCompId){
        self.selectedBizCompId(params.selectedBizCompId);
      }

        
      self.prepareCntrlData = function () {
        self.cntrlPrgrsVisible(true);
        var cntrlModel = oj.Model.extend({
          idAttribute: 'cid'
        });

        self.cntrlCollection = oj.Collection.extend({
           model: cntrlModel,
           comparator: "cid"
          ,sync: self.cmpntControlCollSync
        });

        self.controlDataSource = new self.cntrlCollection();
        self.cntrlRgnDataProvider(new CollectionDataProvider(self.controlDataSource));
        self.cntrlPrgrsVisible(false);
      };

      self.cmpntControlCollSync = function (method, model, options) {
        console.log("[componentControls]::cmpntControlCollSync begins");
        //console.log("[componentControls]:: REST URI = "+restModule.API_URL.viewComponentControls);

        var cmpntControlService = {url: restModule.API_URL.viewComponentControls, method: "GET", data: {}};
        /*URL Parameters*/
        cmpntControlService.parameters = {};
        /*Header Parameters*/
        cmpntControlService.headers = {RECORD_ID_VAR: self.selectedBizCompId(), DOMAIN_CODE_VAR: app.selectedDomainCode(), INDUSTRY_VAR : app.selectedIndustryCode()};
        restModule.callRestAPI(cmpntControlService, function (response) {
            console.log("[componentControls]:: Component Controls Success Response");
            if (response.items && response.items != null) {
              console.log(response.items);
              options["success"](response.items, null, options);
            } else {
              options["success"](null, null, options);
            }
            }, function (failResponse) {
                var controlServiceFailPrompt = "Component Control Service failure";
                console.log(controlServiceFailPrompt);
                console.log(failResponse);
                options["error"](failResponse, null, options);
                app.showMessages(null, 'error', controlServiceFailPrompt);
            });
        };      

      self.prepareCntrlData();


    }
    
  });