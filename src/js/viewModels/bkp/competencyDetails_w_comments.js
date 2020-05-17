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

      this.selectedItemKpi = ko.observable("kpi");
      this.currentEdgeKpi = ko.observable("top");

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

        /* console.log(method);
        console.log(options);
        console.log(model); */
        console.log(restModule.API_URL.viewCompetencyKpis);

        var cmptncyKpiService = {url: restModule.API_URL.viewCompetencyKpis, method: "GET", data: {}};
        /*URL Parameters*/
        cmptncyKpiService.parameters = {};
        /*Header Parameters*/
        cmptncyKpiService.headers = {COMPETENCY_CODE_VAR: self.selectedCompetencyId(), DOMAIN_CODE_VAR:app.selectedDomainCode() };
        restModule.callRestAPI(cmptncyKpiService, function (response) {
          console.log("[competencyDetails]:: Competency KPI (Benchmarks) Success Response");
          if (response.items && response.items != null) {
            console.log(response.items);
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
        self.prepareCompetencyKpi();
      //-----code addition for Competency Benchmarks ends-----------------
        
      //-----code addition for Competency Details ends-----------------

/*       var data = {
          "Sourcing": [{
                  "kp_id" : "59691",
                  "name" : "Average time in days for sourcing events.  (Starting when the need is identified through a request from an internal stakeholder, ending when contract is signed.)"
              }, {
                  "kp_id" : "59699",
                  "name" : "Typical savings goal (percentage) that the procurement organization sets to deliver on sourcing events/projects."
              }, {
                  "kp_id" : "59689",
                  "name" : "Average payment days, considering typical negotiated payment terms."
              }, {
                  "kp_id" : "59698",
                  "name" : "Typical achieved savings (percentage) that the procurement organization actually delivers on sourcing events/projects."
              }, {
                  "kp_id" : "52446",
                  "name" : "Average payment period (days payable outstanding)."
              }, {
                  "kp_id" : "59692",
                  "name" : "Average time in days to establish a contract. (Starting when the negotiation is opened, ending when the contract is signed.)"
              }, {
                  "kp_id" : "54741",
                  "name" : "Total cost of procurement as a percentage of purchase value (includes providing sourcing governance and performing category management, selecting suppliers and developing/maintaining contracts, ordering materials/services, and managing suppliers.)"
              }, {
                  "kp_id" : "59685",
                  "name" : "Total procurement FTEs per one billion USD spend.  Procurement processes include sourcing governance and category management, selecting suppliers and developing/maintaining contracts, ordering materials and services, and managing suppliers."
              }, {
                  "kp_id" : "59700",
                  "name" : "Total annual cost takeout savings obtained from procurement department on goods and services purchased, as a percentage of total annual spend.  Cost takeout is defined as paying less for what was already being purchased, calculated as as the difference between current and prior year spend for the same or similar recurring purchases."
              }
          ],
          "EmployeeExpense" : [
          {
            "kpi_id": "59701",
            "name": "Total annual cost avoidance savings obtained from procurement department on goods and services purchased, as a percentage of total annual spend.  Cost avoidance is reducing future costs (intangible savings) typically achieved through actions such as negotiating lower rates for new goods and services to be purchased."
          }, {
            "kpi_id": "56284",
            "name": "Total cost of the process \"process accounts payable\" as a percentage of revenue."
          }, {
            "kpi_id": "56285",
            "name": "Total cost of the process \"process accounts payable\" as a percentage of cost of continuing operations."
          }, {
            "kpi_id": "56286",
            "name": "Total cost of the process \"process accounts payable\" as a percentage of purchases."
          }, {
            "kpi_id": "58794",
            "name": "Internal personnel cost (including benefits) of the process \"process accounts payable\" as a percentage of revenue."
          }, {
            "kpi_id": "58795",
            "name": "Internal personnel cost (including benefits) of the process \"process accounts payable\" as a percentage of cost of continuing operations."
          }, {
            "kpi_id": "58796",
            "name": "Internal personnel cost (including benefits) of the process \"process accounts payable\" as a percentage of purchases."
          }, {
            "kpi_id": "58797",
            "name": "Internal systems cost of the process \"process accounts payable\" as a percentage of revenue."
          }, {
            "kpi_id": "58798",
            "name": "Internal systems cost of the process \"process accounts payable\" as a percentage of cost of continuing operations."
          }, {
            "kpi_id": "58799",
            "name": "Internal systems cost of the process \"process accounts payable\" as a percentage of purchases."
          }, {
            "kpi_id": "159",
            "name": "Cycle time in hours to enter invoice data into the system."
          }, {
            "kpi_id": "160",
            "name": "Cycle time in days (including weekends) to resolve an invoice error."
          }, {
            "kpi_id": "290",
            "name": "Cycle time in days (including weekends) from receipt of invoice until approved and scheduled for payment."
          }, {
            "kpi_id": "54598",
            "name": "Percentage of invoice line items received using electronic or automated methods."
          }, {
            "kpi_id": "54602",
            "name": "Total annual number of vendor inquiries received per \"respond to inquiries\" FTE."
          }, {
            "kpi_id": "56293",
            "name": "Percentage of invoice line items that are matched the first time."
          }, {
            "kpi_id": "56295",
            "name": "Percentage of invoice line items matched with a purchase order."
          }, {
            "kpi_id": "56296",
            "name": "Percentage of invoice line items received through EDI."
          }, {
            "kpi_id": "286",
            "name": "Number of FTEs for the process \"process accounts payable\" per one billion USD revenue."
          }, {
            "kpi_id": "285",
            "name": "Number of FTEs for the process \"process accounts payable\" per one billion USD purchases."
          }, {
            "kpi_id": "287",
            "name": "Number of FTEs for the process \"process accounts payable\" per one billion USD cost of continuing operations."
          }, {
            "kpi_id": "163",
            "name": "Number of invoices processed per \"process accounts payable\" FTE."
          }, {
            "kpi_id": "165",
            "name": "Value of purchases per \"process accounts payable\" FTE."
          }]
      };

      this.dataProviderKPIs = new ArrayDataProvider(data.EmployeeExpense, { keyAttributes: 'kpi_id' });
      
      var data = [{
        role_name: 'COO',
        id: '1',
        link: '#'
      },
      {
        role_name: 'Head of Procurement Policy and Strategy',
        id: '2',
        link: '#'
      },
      {
        role_name: 'Head of Supplier Relationship Management',
        id: '3',
        link: '#'
      }];
      this.dataProviderRoles = new ArrayDataProvider(data, { keyAttributes: 'id' });

      var data = [{
        name: 'Sourcing',
        id: '1'
      },
      {
        name: 'Procurement Contracts',
        id: '2'
      },
      {
        name: 'Supplier Qualification',
        id: '3'
      }];
      this.dataProviderModules = new ArrayDataProvider(data, { keyAttributes: 'id' });
 */
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

        /* console.log(method);
        console.log(options);
        console.log(model); */
        console.log(restModule.API_URL.viewCompetencyRoles);

        var cmptncyRoleService = {url: restModule.API_URL.viewCompetencyRoles, method: "GET", data: {}};
        /*URL Parameters*/
        cmptncyRoleService.parameters = {};
        /*Header Parameters*/
        cmptncyRoleService.headers = {COMPETENCY_CODE_VAR: self.selectedCompetencyId(), DOMAIN_CODE_VAR:app.selectedDomainCode() };
        restModule.callRestAPI(cmptncyRoleService, function (response) {
          console.log("[competencyDetails]:: Competency Roles Success Response");
          if (response.items && response.items != null) {
            console.log(response.items);
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

        /* console.log(method);
        console.log(options);
        console.log(model); */
        console.log(restModule.API_URL.viewCompetencyModules);

        var cmptncyModuleService = {url: restModule.API_URL.viewCompetencyModules, method: "GET", data: {}};
        /*URL Parameters*/
        cmptncyModuleService.parameters = {};
        /*Header Parameters*/
        cmptncyModuleService.headers = {COMPETENCY_CODE_VAR: self.selectedCompetencyId(), DOMAIN_CODE_VAR:app.selectedDomainCode() };
        restModule.callRestAPI(cmptncyModuleService, function (response) {
          console.log("[competencyDetails]:: Competency Modules Success Response");
          if (response.items && response.items != null) {
            console.log(response.items);
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
      
    }
    
  });