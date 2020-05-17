/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery','appController', 'ojs/ojarraydataprovider', 'restModule', 'ojs/ojmodel', 'ojs/ojknockout', 'ojs/ojselectcombobox', 'ojs/ojbutton', 'ojs/ojvalidationgroup'],
  function (oj, ko, $, app, ArrayDataProvider, restModule) {

    function SearchPortalViewModel() {
      var self = this;
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.


      // ----------------------------- Dropdown dynamic alignment starts -----------
      // can be made static later and removed
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

      //-----------button handler code begins------
      this.applyButton = "Proceed";
      this.applyButtonClick = function (event) {

        //validation...
        document.getElementById("industry").validate();
        document.getElementById("process").validate();
        
        var tracker = document.getElementById("tracker");
        if (tracker.valid === "valid")
        {
          app.selectedDomainCode(self.processVal());
          app.selectedIndustryCode(self.industryVal());

          app.selectedDomain(document.getElementById('industry').value);
          app.selectedDomainBwl();
          app.selectedDomainDesc();
          app.selectedIndustry();
          
          console.log("[searchPortal]: Selected Domain and Selected Industry codes have been set ----");
          console.log("[searchPortal]: selectedDomainCode="+app.selectedDomainCode());
          console.log("[searchPortal]: selectedIndustryCode="+app.selectedIndustryCode());
          oj.Router.rootInstance.go('dataGrid');
          return true;
        }
            
      }.bind(this);

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
      // self.industryBaseUrl = "http://129.150.172.40:8080/ords/portal_workspace/xxibm_portal_industry_map/xxibm_portal_industry_map_get/";
      // //-----------Industry Dropdown code ends-----------
      // //----Sai addition for Industry REST service consumption begins-----
      // /*Industry model definition*/
      // var indModel = oj.Model.extend({
      //   idAttribute: 'ind_code'
      // });
      // /*Industry collection definition*/
      // self.indCollection = oj.Collection.extend({
      //   url: self.industryBaseUrl,
      //   model: indModel,
      //   comparator: "ind_code"
      // });
      // self.indSource = new self.indCollection();

      // //Call FetchMethod to load the dropdown
      // self.indSource.fetch().then(
      //   function (success) {
      //     console.log("Industry Response");
      //     console.log(success.items);
      //     self.industryOptionsDP(new ArrayDataProvider(success.items, {keyAttributes: 'ind_code'}));
      //   },
      //   function (failure) {
      //     console.log("2-Inside Industry Failure method");
      //     console.log(failure);

      //   }
      // );
      //----Sai addition for Industry REST service consumption ends-------

      //-----------Process Dropdown code begins---------
      self.processVal = ko.observable("");
      self.processOptionsDP = ko.observableArray([]);
      self.processOptKeys = { value: "dom_code", label: "dom_value" };
      // self.processBaseUrl = "http://129.150.172.40:8080/ords/portal_workspace/xxibm_portal_domain_map/xxibm_portal_domain_map_get/";      
      // //-----------Process Dropdown code ends-----------
      // //----Sai addition for Process REST service consumption begins-----
      // /*Process model definition*/
      // var processModel = oj.Model.extend({
      //   idAttribute: 'dom_code'
      // });
      // /*Process collection definition*/
      // self.processCollection = oj.Collection.extend({
      //   url: self.processBaseUrl,
      //   model: processModel,
      //   comparator: "dom_value"
      // });
      // self.processSource = new self.processCollection();
      // /*Process Collection end*/

      // self.processSource.fetch().then(
      //   function (success) {
      //     console.log("Process Response");
      //     console.log(success.items);
      //     app.domainMetaData(success.items);
      //     console.log(app.domainMetaData());
      //     self.processOptionsDP(new ArrayDataProvider(success.items, {keyAttributes: 'dom_code'}));
      //   },
      //   function (failure) {
      //     console.log("2-Inside Process Call Failure");
      //     console.log(failure);

      //   }
      // );
      /*Call Fetch Method ends*/
      //----Sai addition for Process REST service consumption ends-------

 
    //------code addition for process list view begins---------------
    self.loadProcessListData = function () {

      console.log("[searchPortal]::loadProcessListData begins");
      console.log("[searchPortal]:: REST URI = "+restModule.API_URL.getDomains);

      var processService = {url: restModule.API_URL.getDomains, method: "GET", data: {}, parameters:{}, headers:{}};
      
      restModule.callRestAPI(processService, function (response) {
          //console.log("[searchPortal]:: Get Process List Success Response");
          if (response.items && response.items != null) {
            //console.log(response.items);
            self.processOptionsDP([]);
            self.processOptionsDP(new ArrayDataProvider(response.items, {keyAttributes: 'dom_code'}));
                    
          } else {

          }
          }, function (failResponse) {
              var processServiceFailPrompt = "Get Process List Service failure";
              console.log(processServiceFailPrompt);
              console.log(failResponse);
              
              app.showMessages(null, 'error', processServiceFailPrompt);
          });
      };
      //------code addition for process list view ends---------------
 
      //------code addition for industry list view begins---------------
      self.loadIndustryListData = function () {

        console.log("[searchPortal]::loadIndustryListData begins");
        console.log("[searchPortal]:: REST URI = "+restModule.API_URL.getIndustries);

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



      


      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function () {
        self.loadProcessListData();
        self.loadIndustryListData();
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
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new SearchPortalViewModel();
  }
);