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
      self.rolePrgrsVisible = ko.observable(false);
      self.waitProgress = ko.observable(-1);

      this.selectedCmptncyTab = ko.observable("roles");
      this.currentCmptncyTabEdge = ko.observable("top");

      self.competencyKpiDataProvider = ko.observable();
      self.competencyKpiCollection = null;
      self.competencyRoleDataProvider = ko.observable();
      self.competencyRoleCollection = null;
      self.competencyRoleData =  ko.observable([]);
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
            constructRoleData(response.items);
            options["success"](self.competencyRoleData(), null, options);
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

      self.loadCompetencyRoles = function () {
        console.log("[competencyDetails]::loadCompetencyRoles begins");

        //console.log(restModule.API_URL.viewCompetencyRoles);
        self.rolePrgrsVisible(true);
        var cmptncyRoleService = {url: restModule.API_URL.viewCompetencyRoles, method: "GET", data: {}};
        /*URL Parameters*/
        cmptncyRoleService.parameters = {};
        /*Header Parameters*/
        cmptncyRoleService.headers = {COMPETENCY_CODE_VAR: self.selectedCompetencyId(), DOMAIN_CODE_VAR:app.selectedDomainCode() };
        restModule.callRestAPI(cmptncyRoleService, function (response) {
          console.log("[competencyDetails]:: loadCompetencyRoles - Competency Roles Success Response");
          if (response.items && response.items != null) {
            //console.log(response.items);
            constructRoleData(response.items);
          } else {
            console.log("[competencyDetails]:: loadCompetencyRoles - No role response available for competency");
          }
          self.rolePrgrsVisible(false);
          }, function (failResponse) {
              self.rolePrgrsVisible(false);
              var cmptncyRoleSrvcFailPrompt = "[competencyDetails]:: loadCompetencyRoles - Competency Role Service failure";
              console.log(cmptncyRoleSrvcFailPrompt);
              console.log(failResponse);
              app.showMessages(null, 'error', cmptncyRoleSrvcFailPrompt);
          });
        };
        //self.loadCompetencyRoles();
        
      /**Construct Competency Role data */
      function constructRoleData(data) 
      {
        let cmptncyRoleDataTmp = [];
        //console.log(data);
        data.forEach((element) => {
          let role = null;
          /**Create a Role */
          role = new Role(element);
          cmptncyRoleDataTmp.push(role);
          //console.log(role);
        });
        //console.log(cmptncyRoleDataTmp);
        self.competencyRoleData(cmptncyRoleDataTmp);
        /* self.competencyRoleDataProvider(new ArrayDataProvider(cmptncyRoleDataTmp, {
          keyAttributes: Role.rnm
        })); */
        //console.log(self.competencyRoleDataProvider());
      }

      /**Role Prototype */
      function Role(element)
      {
        this.roleName = element.rnm;
        this.roleDesc = element.rdsc;
        this.roleDashboard = element.dlnk.trim();
        this.showRoleDescFlag = ko.observable(false);
      }
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

      /**Event Handler for Role List Cell Click to show / hide Role Metadata: Description & Dashboard Link */
      self.showHideRoleMetadataOnRoleClick = function(data,element)
      {
        console.log("[competencyDetails]:: handleRoleClick begins");
        // console.log(data, element);        
        // console.log(data.srcElement, element.data);
        element.data.showRoleDescFlag(!element.data.showRoleDescFlag());
        console.log("[[competencyDetails]:: handleRoleClick ends");

      }.bind(this);

      console.log("[competencyDetails]: Ends");
      
    }
    
  });