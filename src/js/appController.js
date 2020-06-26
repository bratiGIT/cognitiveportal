/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['knockout', 'ojs/ojmodule-element-utils', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojrouter', 'ojs/ojarraydataprovider', 'ojs/ojknockouttemplateutils', 'restModule', 'ojs/ojmodel','ojs/ojmodule-element', 'ojs/ojknockout', 'ojs/ojdialog', 'ojs/ojselectcombobox','ojs/ojmessages', 'ojs/ojmessage','ojs/ojprogress','restModule' ],
  function(ko, moduleUtils, ResponsiveUtils, ResponsiveKnockoutUtils, Router, ArrayDataProvider, KnockoutTemplateUtils, restModule) {
     function ControllerViewModel() {
       var self = this;

       self.KnockoutTemplateUtils = KnockoutTemplateUtils;

       //--------dhrajago addition for global variables begins--------
       self.loggedInClient = ko.observable();
       self.selectedDomainCode = ko.observable("DOM002");
       self.selectedIndustryCode = ko.observable("IND002");
       self.selectedBWL = ko.observable("#");
       self.localizationLnk = ko.observable("#");
      //Global Industry / Domain Context Data
      self.selectedDomain = ko.observable();
      self.selectedDomainBwl = ko.observable();
      self.selectedDomainDesc = ko.observable();
      self.selectedIndustry = ko.observable();
      self.domainMetaData = ko.observableArray([]);

      self.selectedIndustryTxt = ko.observable();
      self.selectedDomainTxt = ko.observable();
      self.slctdPolarItm = ko.observable({cmptncy:""});
      self.frmScreen = ko.observable("searchPortal");

       //--------dhrajago addition for global variables ends--------

      // Media queries for repsonsive layouts
      var smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

       // Router setup
       self.router = Router.rootInstance;
              self.router.configure({
          'login': {label: 'Login', isDefault: true}
         ,'searchPortal': {label: 'SearchPortal'}
         ,'dataGrid': {label: 'DataGrid'}
         ,'panelCompList': {label: 'PanelCompList'}
         ,'survey': {label:'Survey'}
       });
      Router.defaults['urlAdapter'] = new Router.urlParamAdapter();

      self.moduleConfig = ko.observable({'view':[], 'viewModel':null});
      self.showBars = ko.observable(true);
      self.showTitle = ko.observable(false);
      self.setPadding = ko.observable(0);
      self.isLoginFlag = ko.observable(false);

      self.loadModule = function() {
        ko.computed(function() {
          var name = self.router.moduleConfig.name();
          if(name=="login") { 
            clearSessionParams("ALL");
            self.showBars(true);
            self.showTitle(true);
            self.setPadding = ko.observable(0);
            self.isLoginFlag(true);
          } else {
            self.showBars(false);
            self.showTitle(false);
            self.setPadding = ko.observable(10);
            self.isLoginFlag(false);
          }
          var viewPath = 'views/' + name + '.html';
          var modelPath = 'viewModels/' + name;
          var masterPromise = Promise.all([
            moduleUtils.createView({'viewPath':viewPath}),
            moduleUtils.createViewModel({'viewModelPath':modelPath})
          ]);
          masterPromise.then(
            function(values){
              self.moduleConfig({'view':values[0],'viewModel':values[1]});
            }
          );
        });
      };

      this.loadDataGridModule = function(){
        var dataGridPromise = Promise.all([
          moduleUtils.createView({'viewPath':'views/dataGrid.html'}),
          moduleUtils.createViewModel({'viewModelPath':'viewModels/dataGrid'})
        ]);
        dataGridPromise.then(
          function(values){
            self.moduleConfig({'view':values[0],'viewModel':values[1]});
          }
        );
      }

      this.loadSearchPortalModule = function(){
        var dataGridPromise = Promise.all([
          moduleUtils.createView({'viewPath':'views/searchPortal.html'}),
          moduleUtils.createViewModel({'viewModelPath':'viewModels/searchPortal'})
        ]);
        dataGridPromise.then(
          function(values){
            self.moduleConfig({'view':values[0],'viewModel':values[1]});
          }
        );
      }
      
      self.setCntrlrObjsInSession = function(){
        setInSession('selectedDomain',self.selectedDomain());
        setInSession('selectedIndustryTxt',self.selectedIndustryTxt());
        setInSession('selectedDomainTxt',self.selectedDomainTxt());
        setInSession('selectedDomainCode',self.selectedDomainCode());
        setInSession('selectedIndustryCode',self.selectedIndustryCode());
        setInSession('selectedBWL',self.selectedBWL());
        setInSession('localizationLnk',self.localizationLnk());
        setInSession('loggedInClient',self.loggedInClient());
        setInSession('userLogin',self.userLogin());
      }

      self.updateCntrlrObjsFrmSession = function(){
        self.selectedDomain(getFromSession('selectedDomain'));
        self.selectedIndustryTxt(getFromSession('selectedIndustryTxt'));
        self.selectedDomainTxt(getFromSession('selectedDomainTxt'));
        self.selectedDomainCode(getFromSession('selectedDomainCode'));
        self.selectedIndustryCode(getFromSession('selectedIndustryCode'));
        self.selectedBWL(getFromSession('selectedBWL'));
        self.localizationLnk(getFromSession('localizationLnk'));
        self.loggedInClient(getFromSession('loggedInClient'));
        self.userLogin(getFromSession('userLogin'));
      }
      // Navigation setup
      /* var navData = [
      {name: 'Search Portal', id: 'searchPortal',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'},
      {name: 'Data Grid', id: 'dataGrid',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24'},
       {name: 'Incidents', id: 'incidents',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24'},
      {name: 'About', id: 'about',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24'}
      ];
      self.navDataProvider = new ArrayDataProvider(navData, {keyAttributes: 'id'}); */

      // Header
      // Application Name used in Branding Area
      self.appName = ko.observable("Cognitive Enterprise");
      self.appNameSubtitle = ko.observable(" | Powered By IBM RapidMove for Oracle Cloud");
      // User Info used in Global Navigation area
      self.userLogin = ko.observable("client.com");
      
      //---- dhrajago addition for Global Messages & Global Progress Indicator begins----
      /*Global progress indicator*/
      self.globalProgress = ko.observable(-1);
      self.globalProgressVisible = ko.observable(false);
      self.showGlobalProgress = function(){
          console.log("show progress");
          self.globalProgressVisible(true);
          console.log($("#globalProgressC"));
          $("#globalProgressC").css("visibility","visible"); 
          console.log(self.globalProgressVisible());
      };
      self.hideGlobalProgress = function(){
          console.log("hide progress");
          $("#globalProgressC").css("visibility","hidden"); 
          self.globalProgressVisible(false);
      };
      /*Global Progress indicator*/
      
      /*Global message section start*/
      self.messages = ko.observableArray([]);
      self.messagesDataprovider = new ArrayDataProvider(self.messages);
      //set the message and corresponding style for each oj-message
      self.showMessages = function(messages,messageSeverity,messageSummary){
         var messagesToShow = null;
         if(messageSeverity && messageSummary){
             messagesToShow = [{
                                severity: messageSeverity,
                                summary: messageSummary,
                                detail: '',
                                autoTimeout: parseInt("5000")
                            }];
         } else
             messagesToShow = messages;
       self.messages(messagesToShow);
       var messageElements = $("#globalMessage").find("oj-message");
       for(i=0;i<messageElements.length; i++){
           messageElements[i].classList.add(messagesToShow[i].severity);
       }
      };
      /*Global message section end*/
      //---- dhrajago addition for Global Messages & Global Progress Indicator ends------

      //-----------Currency Dropdown code begins---------
      self.selCurrencyVal = ko.observable("USD");
      self.currencyOptionsDP = ko.observableArray([]);
      self.currencyOptKeys = { value: "curr_code", label: "curr_value" };

      //Set Session Currency
      var currencyFrmSession = getCurrentUserCurrency();
      console.log("Currency From Session: "+currencyFrmSession);
      self.selCurrencyVal(currencyFrmSession);


      //------code addition for currency list view begins---------------
      self.loadCurrencyListData = function () {

        console.log("[appController]::loadCurrencyListData begins");
        console.log("[appController]:: REST URI = "+restModule.API_URL.getCurrencies);

        var currencyService = {url: restModule.API_URL.getCurrencies, method: "GET", data: {}, parameters:{}, headers:{}};
        
        restModule.callRestAPI(currencyService, function (response) {
            //console.log("[appController]:: Get Currency List Success Response");
            if (response.items && response.items != null) {
              //console.log(response.items);
              self.currencyOptionsDP([]);
              self.currencyOptionsDP(new ArrayDataProvider(response.items, {keyAttributes: 'curr_code'}));
                      
            } else {

            }
            }, function (failResponse) {
                var currencyServiceFailPrompt = "Get Currency List Service Failed";
                console.log(currencyServiceFailPrompt);
                console.log(failResponse);
                
                app.showMessages(null, 'error', currencyServiceFailPrompt);
            });
      };
      //------code addition for currency list view ends---------------
      //-----------Currency Dropdown code ends---------
      

     
      //----------Fetch Currency Conversion Rate Begins-------------
      //self.currencyParam = ko.observable("USD_"+self.selCurrencyVal());      
      self.currencyRate = ko.observable("1");
      console.log("[appController]:Currency Rate Service Callout::");
      
      this.currencyChangeHandler = function (event)
      {
        console.log(self.selCurrencyVal());
        console.log(event);

        self.getCurrConversionRate();  
      }.bind(this);

      self.getCurrConversionRate = function () {

        console.log("[appController]::getCurrConversionRate begins");
        //console.log("[appController]:: REST URI = "+restModule.API_URL.getCurrencyRate);

        var currencyRateService = {url: restModule.API_URL.getCurrencyRate, method: "GET", data: {}};

        /* URL Parameters */
        currencyRateService.parameters = {q:"USD_"+self.selCurrencyVal() , compact: "ultra", apiKey: "d55d72a1712ea2473919"};
        
        /* Header Parameters */
        currencyRateService.headers = {};

        restModule.callRestAPI(currencyRateService, function (response) {
            //console.log("[appController]:: getCurrConversionRate : Fetch Currency Rate Service Success Response");
            if (response && response != null) {
              for( var key in response){
                self.currencyRate(response[key]);
                setCurrentUserCurrencyRate(self.currencyRate());
                setCurrentUserCurrency(self.selCurrencyVal());
                console.log("[appController]::getCurrConversionRate:: Currency Rate is => ");
                console.log(response[key]);
              }
            } else {
              console.log("[appController]::getCurrConversionRate:: No currency rate defined");
            }
            }, function (failResponse) {
                var currencyRateServiceFailPrompt = "Fetch Currency Rate Service Failed";
                console.log(currencyRateServiceFailPrompt);
                console.log(failResponse);
                
                app.showMessages(null, 'error', currencyRateServiceFailPrompt);
            });
        };
      //----------Fetch Currency Conversion Rate ends-------------
      
      self.setLoggedInClient = (username) => {
        let _client_name = "";
        if(username && username != null){
          console.log(username.length);console.log(username.length-4);console.log(username.indexOf("@")+1);
          _client_name = username.substr(11,(username.lastIndexOf('.com')-(username.indexOf("@")+1))); 
        }        
        console.log(_client_name);
        self.loggedInClient(_client_name.toUpperCase());
      }

      self.logOut = function(event) {
        self.setPadding = ko.observable(0);
        oj.Router.rootInstance.go('login');
      }


      self.close = function (event) {
        var selCurrVal = document.getElementById('currencyList').value;
        console.log(selCurrVal);
        if(selCurrVal!="")
         {
          setCurrentUserCurrency(selCurrVal);
          if (selCurrVal === "USD")
            setCurrentUserCurrencyRate("1.0");
         }
        document.getElementById('currencyDialog').close();
        $("#cbmCurrency").text(selCurrVal); 
      }

      self.openPrefDialog = function (event) {
        self.loadCurrencyListData();
        document.getElementById('currencyDialog').open();
      }

      // Footer
      function footerLink(name, id, linkTarget) {
        this.name = name;
        this.linkId = id;
        this.linkTarget = linkTarget;
      }
      self.footerLinks = ko.observableArray([
        new footerLink('About Oracle', 'aboutOracle', 'http://www.oracle.com/us/corporate/index.html#menu-about'),
        new footerLink('Contact Us', 'contactUs', 'http://www.oracle.com/us/corporate/contact/index.html'),
        new footerLink('Legal Notices', 'legalNotices', 'http://www.oracle.com/us/legal/index.html'),
        new footerLink('Terms Of Use', 'termsOfUse', 'http://www.oracle.com/us/legal/terms/index.html'),
        new footerLink('Your Privacy Rights', 'yourPrivacyRights', 'http://www.oracle.com/us/legal/privacy/index.html')
      ]);

     }

     return new ControllerViewModel();
  }
);
