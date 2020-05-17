define(['ojs/ojcore', 'knockout', 'jquery', 'appController','ojs/ojmodel', 'ojs/ojarraydataprovider','ojs/ojcollectiondataprovider',
'restModule','ojs/ojknockout','ojs/ojswitcher'],
  function (oj, ko, $, app, Model, ArrayDataProvider,CollectionDataProvider,restModule) {
     /** This module will not return a new instance of it. Wherever this module is required, 
      * createViewModule can be used to instantiate it. This is loaded in dataGrid page*/
     return function ComponentAssetsViewModel(params) {         
      var self = this;

      console.log("[componentAssets]:Begins");
      console.log(params);

      self.assetPrgrsVisible = ko.observable(false);
      self.waitProgress = ko.observable(-1);
      self.selectedBizCompId = ko.observable("");

      var currentURL = ((document.URL.indexOf('#')==-1)?document.URL:document.URL.substring(0,document.URL.indexOf('#')));
      self.customSvgStyle = {fill: 'url(' + currentURL + '#pattern)'};
      console.log(self.customSvgStyle);

      //Assign Module Parameters
      if (params.selectedBizCompId){
        self.selectedBizCompId(params.selectedBizCompId);
      }

      //------code addition for Cognitive RPA Asset Drilldown Listview begins---------------
      self.cogRpaAssetDataProvider = ko.observable();
      self.cogRpaAssetCollection = null;

      self.prepareAssetData = function () {
        self.assetPrgrsVisible(true);
        var cogRpaAssetModel = oj.Model.extend({
          idAttribute: 'aid'
        });

        self.cogRpaAssetCollection = oj.Collection.extend({
           model: cogRpaAssetModel
          ,comparator: "aid"
          ,sync: self.cmpntAssetCollSync
        });

        self.cogRpaAssetSource = new self.cogRpaAssetCollection();
        self.cogRpaAssetDataProvider(new CollectionDataProvider(self.cogRpaAssetSource));
        self.assetPrgrsVisible(false);
      };

      self.cmpntAssetCollSync = function (method, model, options) {
        console.log("[componentAssets]::cmpntAssetCollSync begins");
        console.log("[componentAssets]:: REST URI = "+restModule.API_URL.viewComponentAssets);

        var cmpntAssetService = {url: restModule.API_URL.viewComponentAssets, method: "GET", data: {}};
        /*URL Parameters*/
        cmpntAssetService.parameters = {};
        /*Header Parameters*/
        cmpntAssetService.headers = {RECORD_ID_VAR: self.selectedBizCompId(), DOMAIN_CODE_VAR: app.selectedDomainCode(),INDUSTRY_VAR :  app.selectedIndustryCode()};
        restModule.callRestAPI(cmpntAssetService, function (response) {
            //console.log("[componentAssets]:: Component Asset Success Response");
            if (response.items && response.items != null) {
              //console.log(response.items);
              options["success"](response.items, null, options);
            } else {
              options["success"](null, null, options);
            }
            }, function (failResponse) {
                var assetServiceFailPrompt = "Component Asset Service failure";
                console.log(assetServiceFailPrompt);
                console.log(failResponse);
                 options["error"](failResponse, null, options);
                app.showMessages(null, 'error', assetServiceFailPrompt);
            });
        };
      //------code addition for Cognitive RPA Asset Drilldown Listview ends---------------

      self.prepareAssetData();



    }
    
  });