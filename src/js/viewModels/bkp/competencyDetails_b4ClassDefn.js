define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojmodel', 'restModule', 'ojs/ojarraydataprovider','ojs/ojcollectiondataprovider','ojs/ojknockout','ojs/ojlistview',
'ojs/ojswitcher','ojs/ojbutton','ojs/ojselectsingle','ojs/ojformlayout'],
  function (oj, ko, $, app, Model, restModule, ArrayDataProvider,CollectionDataProvider) {
    
     /** This module will not return a new instance of it. Wherever this module is required, 
      * createViewModule can be used to instantiate it. This is loaded in dataGrid page*/
     return function CompetencyDetailsViewModel(params) {         
      var self = this;

      console.log("[competencyDetails]:Begins");
      console.log(params); 

      self.selectedCompetencyName = ko.observable("");
      self.selectedCompetencyId = ko.observable("");
      self.roleMetadataVisible = ko.observable(false);

      this.selectedCmptncyTab = ko.observable("roles");
      this.currentCmptncyTabEdge = ko.observable("top");

      self.competencyKpiDataProvider = ko.observable();
      self.competencyKpiCollection = null;
      self.competencyRoleDataProvider = ko.observable();
      self.competencyRoleCollection = null;
      self.competencyModuleDataProvider = ko.observable();
      self.competencyModuleCollection = null;

      //Assign Module Parameters
      if (params.selectedCmptncyName){
        self.selectedCompetencyName(params.selectedCmptncyName);
      }
      if (params.selectedCmptncyId){
        self.selectedCompetencyId(params.selectedCmptncyId);
      }

      //----- code addition for Competency Benchmarks begins--------------
      self.prepareCompetencyKpi = function () {

        var competencyKpiModel = oj.Model.extend({
          idAttribute: 'kpi_id'
        });

        self.competencyKpiCollection = oj.Collection.extend({
           model: competencyKpiModel
          ,comparator: "kpi_id"
          ,sync: self.cmptncyKpiCollSync
        });

        self.competencyKpiSource = new self.competencyKpiCollection();
        self.competencyKpiDataProvider(new CollectionDataProvider(self.competencyKpiSource));
        
      };
      self.cmptncyKpiCollSync = function (method, model, options) {
        console.log("[competencyDetails]::cmptncyKpiCollSync begins");

        //console.log(restModule.API_URL.viewCompetencyKpis);

        var cmptncyKpiService = {url: restModule.API_URL.viewCompetencyKpis, method: "GET", data: {}};
        /*URL Parameters*/
        cmptncyKpiService.parameters = {};
        /*Header Parameters*/
        cmptncyKpiService.headers = {COMPETENCY_CODE_VAR: self.selectedCompetencyId(), DOMAIN_CODE_VAR:app.selectedDomainCode() };
        restModule.callRestAPI(cmptncyKpiService, function (response) {
          console.log("[competencyDetails]:: Competency KPI (Benchmarks) Success Response");
          if (response.items && response.items != null) {
            //console.log(response.items);
            options["success"](response.items, null, options);
          } else {
            options["success"](null, null, options);
          }
          }, function (failResponse) {
              var cmptncyKpiSrvcFailPrompt = "Competency Benchmark Service failure";
              console.log(cmptncyKpiSrvcFailPrompt);
              console.log(failResponse);
               options["error"](failResponse, null, options);
              app.showMessages(null, 'error', cmptncyKpiSrvcFailPrompt);
          });
        };
        //self.prepareCompetencyKpi();
      //-----code addition for Competency Benchmarks ends-----------------
        
      //----- code addition for Competency Roles begins--------------
      self.prepareCompetencyRoles = function () {

        var competencyRoleModel = oj.Model.extend({
          idAttribute: 'role_name'
        });

        self.competencyRoleCollection = oj.Collection.extend({
           model: competencyRoleModel
          ,comparator: "role_name"
          ,sync: self.cmptncyRoleCollSync
        });

        self.competencyRoleSource = new self.competencyRoleCollection();
        self.competencyRoleDataProvider(new CollectionDataProvider(self.competencyRoleSource));
        
      };
      self.cmptncyRoleCollSync = function (method, model, options) {
        console.log("[competencyDetails]::cmptncyRoleCollSync begins");

        //console.log(restModule.API_URL.viewCompetencyRoles);

        var cmptncyRoleService = {url: restModule.API_URL.viewCompetencyRoles, method: "GET", data: {}};
        /*URL Parameters*/
        cmptncyRoleService.parameters = {};
        /*Header Parameters*/
        cmptncyRoleService.headers = {COMPETENCY_CODE_VAR: self.selectedCompetencyId(), DOMAIN_CODE_VAR:app.selectedDomainCode() };
        restModule.callRestAPI(cmptncyRoleService, function (response) {
          console.log("[competencyDetails]:: Competency Roles Success Response");
          if (response.items && response.items != null) {
            //console.log(response.items);
            options["success"](response.items, null, options);
          } else {
            options["success"](null, null, options);
          }
          }, function (failResponse) {
              var cmptncyRoleSrvcFailPrompt = "Competency Role Service failure";
              console.log(cmptncyRoleSrvcFailPrompt);
              console.log(failResponse);
               options["error"](failResponse, null, options);
              app.showMessages(null, 'error', cmptncyRoleSrvcFailPrompt);
          });
        };
        self.prepareCompetencyRoles();
      //-----code addition for Competency Roles ends-----------------

      //----- code addition for Competency Modules begins--------------
      self.prepareCompetencyModules = function () {

        var competencyModuleModel = oj.Model.extend({
          idAttribute: 'module'
        });

        self.competencyModuleCollection = oj.Collection.extend({
           model: competencyModuleModel
          ,comparator: "module"
          ,sync: self.cmptncyModuleCollSync
        });

        self.competencyModuleSource = new self.competencyModuleCollection();
        self.competencyModuleDataProvider(new CollectionDataProvider(self.competencyModuleSource));
        
      };
      self.cmptncyModuleCollSync = function (method, model, options) {
        console.log("[competencyDetails]::cmptncyModuleCollSync begins");
        //console.log(restModule.API_URL.viewCompetencyModules);

        var cmptncyModuleService = {url: restModule.API_URL.viewCompetencyModules, method: "GET", data: {}};
        /*URL Parameters*/
        cmptncyModuleService.parameters = {};
        /*Header Parameters*/
        cmptncyModuleService.headers = {COMPETENCY_CODE_VAR: self.selectedCompetencyId(), DOMAIN_CODE_VAR:app.selectedDomainCode() };
        restModule.callRestAPI(cmptncyModuleService, function (response) {
          console.log("[competencyDetails]:: Competency Modules Success Response");
          if (response.items && response.items != null) {
            //console.log(response.items);
            options["success"](response.items, null, options);
          } else {
            options["success"](null, null, options);
          }
          }, function (failResponse) {
              var cmptncyModuleSrvcFailPrompt = "Competency Module Service failure";
              console.log(cmptncyModuleSrvcFailPrompt);
              console.log(failResponse);
               options["error"](failResponse, null, options);
              app.showMessages(null, 'error', cmptncyModuleSrvcFailPrompt);
          });
        };
        self.prepareCompetencyModules();
      //-----code addition for Competency Modules ends-----------------

      /**
       * Code for ListView Cell click of Competency Role
       */
      self.isRoleSelected = function()
      {
        console.log("[competencyDetails]:: isRoleSelected begins");
        if(1 == 1)
          return true;
        else
          return false;
      };

      self.handleCmtncyRoleClick = function (event) {
        console.log("[competencyDetails]:: handleCmtncyRoleClick begins");
        console.log(event);
        if (event.detail.value != null && event.detail.value.length > 0) {
          // console.log(event.detail.items[0]);
          // console.log($("#"+event.detail.items[0].id+" #RoleMetadataContainer"));
          // self.roleMetadataVisible(true);
          $("#"+event.detail.items[0].id+" #RoleMetadataContainer").toggleClass("demo-region-hide");
          
          //$("#"+event.detail.items[0].id).toggle(ko.utils.unwrapObservable(self.roleMetadataVisible()));

          
        }
        else
        {
          //$("#"+event.detail.items[0].id+" #RoleMetadataContainer").toggleClass("demo-region-hide");
          console.log(event.detail);
        }
        console.log("[[competencyDetails]:: handleCmtncyRoleClick ends");
      }.bind(this);

      console.log("[competencyDetails]:Ends");
      
    }
    
  });