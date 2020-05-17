define(['ojs/ojcore', 'knockout', 'jquery', 'appController','ojs/ojmodel', 'ojs/ojarraydataprovider','ojs/ojcollectiondataprovider'
        ,'restModule','ojs/ojknockout','ojs/ojswitcher'],
  function (oj, ko, $, app, Model, ArrayDataProvider,CollectionDataProvider,restModule) {
     /** This module will not return a new instance of it. Wherever this module is required, 
      * createViewModule can be used to instantiate it. This is loaded in dataGrid page*/
     return function ComponentBenchmarksViewModel(params) {         
      var self = this;

      console.log("[componentBenchmarks]:Begins");
      console.log(params);

      self.kpiPrgrsVisible = ko.observable(false);
      self.waitProgress = ko.observable(-1);
      self.selectedBizCompId = ko.observable("");
      self.cmpntkpiDataProvider = ko.observable();
      self.componentKpiCollection = null;

      if (params.selectedBizCompId){
        self.selectedBizCompId(params.selectedBizCompId);
      }

      /*Method to invoke Component Benchmark REST Service*/
      self.prepareKpiData = function () {
        self.kpiPrgrsVisible(true);
        var componentKpiModel = oj.Model.extend({
          idAttribute: 'kpi_id'
        });

        self.componentKpiCollection = oj.Collection.extend({
           model: componentKpiModel
          ,comparator: "kpi_id"
          ,sync: self.componentKpiCollSync
        });

        self.componentKpiSource = new self.componentKpiCollection();
        self.cmpntkpiDataProvider(new CollectionDataProvider(self.componentKpiSource));
        self.kpiPrgrsVisible(false);
      };

      self.componentKpiCollSync = function (method, model, options) {
        console.log("[componentBenchmarks]::componentKpiCollSync begins");
        console.log("[componentBenchmarks]:: REST URI = "+restModule.API_URL.viewComponentKpis);

        var cmpntKpiService = {url: restModule.API_URL.viewComponentKpis, method: "GET", data: {}};
        /*URL Parameters*/
        cmpntKpiService.parameters = {};
        /*Header Parameters*/
        cmpntKpiService.headers = {
            INDUSTRY_VAR: app.selectedIndustryCode() //'IND002'
           ,DOMAIN_CODE_VAR: app.selectedDomainCode() //'DOM001'
           ,RECORD_ID_VAR: self.selectedBizCompId()  //'E10'//'B1'
           ,CONV_RATE_VAR: getCurrentUserCurrencyRate() //'71.236'
           ,CURRENCY_VAR: getCurrentUserCurrency() //'USD'
        };
        restModule.callRestAPI(cmpntKpiService, function (response) {
            console.log("[componentBenchmarks]:: Component KPI (Benchmarks) Success Response");
            if (response.items && response.items != null) {
              //console.log(response.items);
              var formattedResponse = self.applyCurrencyFormat(response.items)
              options["success"](formattedResponse, null, options);
            } else {
              options["success"](null, null, options);
            }
            }, function (failResponse) {
                var cmpntKpiSrvcFailPrompt = "Component Benchmark Service failure";
                console.log(cmpntKpiSrvcFailPrompt);
                console.log(failResponse);
                 options["error"](failResponse, null, options);
                app.showMessages(null, 'error', cmpntKpiSrvcFailPrompt);
            });
        };
      
      //Invoke KPI(Benchmark) REST Service
      self.prepareKpiData();

      self.currencyFormatter = getCurrencyConverter();
      self.applyCurrencyFormat = function (kpiServiceResponse)
      {
        /* for(index=0;i<kpiServiceResponse.length; i++){
          console.log(kpiServiceResponse[index]);

          if(!isNaN(kpiServiceResponse[index].mdn))
            kpiServiceResponse[index].mdn = self.currencyFormatter.format(kpiServiceResponse[index].mdn);
          if(!isNaN(kpiServiceResponse[index].bmark))
            kpiServiceResponse[index].bmark = self.currencyFormatter.format(kpiServiceResponse[index].bmark);
          
          // var testVal = 1103654545.45;
          // console.log(testVal);
          // console.log(self.currencyFormatter.format(testVal)); 
          // self.ordAmt(self.ordAmtConverter.format(detailData.Amt));
        }*/
        
        $.each(kpiServiceResponse,function(index,value){
            // console.log(index);
            // console.log(value.mdn);
            if(!isNaN(kpiServiceResponse[index].mdn))
              kpiServiceResponse[index].mdn = ko.observable(self.currencyFormatter.format(value.mdn));
            if(!isNaN(kpiServiceResponse[index].bmark))
              kpiServiceResponse[index].bmark = ko.observable(self.currencyFormatter.format(value.bmark));  
        });
        
        return kpiServiceResponse;
      };


    }
    
  });