/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your customer ViewModel code goes here
 */
define(['knockout','jquery', 'ojs/ojmodel', 'ojs/ojvalidation-base', 'ojs/ojknockouttemplateutils', 'ojs/ojcollectiondatagriddatasource','ojs/ojarraydataprovider','ojs/ojcollectiondataprovider',
'ojs/ojknockout', 'ojs/ojdatagrid', 'ojs/ojvalidation-number', 'ojs/ojbutton', 'ojs/ojdialog','ojs/ojpopup','ojs/ojlistview','ojs/ojnavigationlist', 'ojs/ojswitcher','ojs/ojcollapsible'],
function(ko,$, Model, ValidationBase, KnockoutTemplateUtils, collectionModule,ArrayDataProvider,CollectionDataProvider) {

    function DataGridViewModel() {
      var self = this;
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function() {
        // Implement if needed
      };

      //dhrajago addition begins
      console.log("Sairam   ---->");
      this.KnockoutTemplateUtils = KnockoutTemplateUtils;
          var collection = new Model.Collection(null, {
              url: '../../json/funds.json'
          });
          this.dataSource = new collectionModule.CollectionDataGridDataSource(collection, 
                      {rowHeader: 'ROWHEADER'});
                      
          /*
          var converterFactory = ValidationBase.Validation.converterFactory("number");
          var currencyOptions = 
          {
              style: "currency", 
              currency: "USD", 
              currencyDisplay:"L2PROCESS1"
          };
          this.currencyConverter = converterFactory.createConverter(
              currencyOptions);
              */	
          /*
          var percentOptions = {style: "percent", minimumFractionDigits:2};
          this.percentConverter = converterFactory.createConverter(percentOptions);
          */
  
          this.columnHeaderStyle = function(headerContext) 
          {
              var column = headerContext['key'];
              /*if (column === 'L2PROCESS6')
              {
                  return 'width:150px;height:50px;background-color: #666666';
              }*/
              return 'width:94px;height:50px;background-color: #666666;font-size:12px;font-weight:bold';
          };
      
          this.cellClassName = function(cellContext) 
          {
              var column = cellContext['keys']['column'];
              
              /*if (column === 'L2PROCESS1') {
                  return 'oj-lg-justify-content-flex-start';
              }else if (column == 'L2PROCESS6'){
                  return 'oj-lg-justify-content-center';
              }return 'oj-helper-justify-content-right';
              */
             //console.log("column = "+column);
             return 'oj-lg-justify-content-flex-start';
          }
          this.cellColorHighlight = function(cellContext) 
          {
              var column = cellContext['keys']['column'];
              
              /*
              if (column === 'L2PROCESS1')
              {
                  return 'background-color: #ccccff';
              }
              else if (column == 'L2PROCESS6')
              {
                  return 'background-color: #e6ecff';
              }
              else if (column == 'L2PROCESS7')
              {
                  return 'background-color: #ccffcc';
              }
              */
              return 'background-color:#e6ecff;font-size:11px;';
          }   
      //dhrajago addition ends

      //dhrajago addition for popup begins
      this.close = function (event) {
        document.getElementById('modalDialog1').close();
      }

      this.open = function (event) {
        document.getElementById('modalDialog1').open();
      }
      this.closeDialog = function (event) {
        document.getElementById('modalDialog2').close();
      }

      this.openDialog = function (event) {
        document.getElementById('modalDialog2').open();
      }
      //dhrajago addition for popup ends

      //popup addition code begins
      this.handleSelectionChanged = function (event)
      {
        var popup = document.getElementById('popup1');
        popup.open('#btnGo');   
      }.bind(this);
      this.cancelListener = function (event)
      {
        var popup = document.getElementById('popup1');
        popup.close();   
      }.bind(this);
      //popup addition code ends

      //tab addition code begins
      this.selectedItem = ko.observable("info");
      this.currentEdge = ko.observable("top");
      this.valueChangedHandler = function (event) {
        var value = event.detail.value,
            previousValue = event.detail.previousValue,
            demoContianer = document.getElementById('demo-container');
        demoContianer.className = demoContianer.className.replace('demo-edge-' + previousValue, 'demo-edge-' + value);
      }
      // Populate some content
      var tabContentNodes = document.querySelectorAll('.demo-tab-content');
      var textNode = document.createElement('p');
      textNode.appendChild(document.createTextNode('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam pharetra, risus ac interdum sollicitudin, sem erat ultrices ipsum, eget vehicula nibh augue sollicitudin ligula. Sed ullamcorper cursus feugiat. Mauris tristique aliquam dictum. Nulla facilisi. Nulla ut sapien sapien. Phasellus tristique arcu id ipsum mattis id aliquam risus sollicitudin.'));
      Array.prototype.forEach.call(tabContentNodes, function(tabContent) {
          for (var i = 0; i < 7; i++) {
            tabContent.appendChild(textNode.cloneNode(true));
          }
      });
      //tab addition code ends


      //------code addition for Component Menu Drilldown begins-------------
      var defaultHeader = "Business Component";
      this.setDialogTitle = ko.observable(defaultHeader);
      
      //Region Rendering Flag
      this.showCommonRegion = ko.observable(true);
      this.showBenchmarkRegion = ko.observable(false);

      // Array Data for Business Component List View
      var data = [
        {id: 0, name: 'Benchmarks',content: 'Benchmark KPI Data'},
        {id: 1, name: 'Roles',content: 'Roles to be added'},
        {id: 2, name: 'Org Chart',content: 'Org Chart to be included'},
        {id: 3, name: 'Reports', content: 'Reports to be included'},
        {id: 4, name: 'Controls & Risks', content: 'Controls & Risks to be included'},
        {id: 5, name: 'Assets', content: 'Assets to be included'},
        {id: 6, name: 'Rapid Move Delivery', content: 'Contents to be added for Rapid Move Delivery'}
        ];
    this.dataProvider = new ArrayDataProvider(data, {
      keys: data.map(function (value) {
        return value.id;
      })
    });
    this.content = ko.observable("");


    this.gotoList = function (event, ui) {
      document.getElementById("listview").currentItem = null;
      this.setDialogTitle(defaultHeader);
      this.slide();
    }.bind(this);

    this.gotoContent = function (event) {
      if (event.detail.value != null && event.detail.value.length > 0) {

        var row = data[event.detail.value];
        this.setDialogTitle(row.name); 
        //alert(this.setDialogTitle());
        console.log("row: is --> ")
        console.log(row);

        switch(row.id)
        {
          //Benchmark
          case 0: 
            this.showCommonRegion(false);
            this.showBenchmarkRegion(true);
            this.content(row.content); 
            break;
          //Default content for all tabs except Benchmark currently
          default: 
            this.showCommonRegion(true);
            this.showBenchmarkRegion(false);
            this.content(row.content); 
        }
        
        console.log("Common Region Rendered =>"+this.showCommonRegion());
        console.log("Benchmark Region Rendered => "+this.showBenchmarkRegion());

        //Hide-Show regions as applicable
        this.slide();

      }
    }.bind(this);

    this.slide = function () {
      document.getElementById('backNavContainer').classList.toggle("demo-region-hide");
      document.getElementById('compHdrRegion').classList.toggle("demo-region-hide");
      document.getElementById('masterRegion').classList.toggle("demo-region-hide");
      document.getElementById('drilldownRegion').classList.toggle("demo-region-hide");
    }
    //------code addition for Component Menu Drilldown ends---------------
    
    //------code addition for KPI Benchmark Drilldown Listview begins---------------
    self.kpiListItems = ko.observableArray();
    this.kpiDataProvider = ko.observable();
    this.kpiCollection = null;

    // responseTime is only added so that the activity indicator is more noticeable
    //var server = new MockPagingRESTServer({"Tweets": JSON.parse(jsonDataStr)}, {collProp:"Tweets", id:"source", responseTime:1000});

    var model = Model.Model.extend({
        idAttribute: 'kpiId'
    });

    var kpiCollection = new Model.Collection(null, {
        url: '../../json/kpi.json',//server.getURL(),
        fetchSize: 15,
        model: model
    });

    this.kpiCollection = kpiCollection;
    this.kpiDataProvider(new CollectionDataProvider(kpiCollection));
    
    //self.kpiListItems(kpiCollection);
    //console.log('Checking Observable Array');
    //console.log(self.kpiListItems());
    
    self.kpiCollection.fetch().then(
      function(response)
      {
       console.log("1-Inside kpiCollection fetch method");
       
       self.kpiListItems(response);
       console.log(self.kpiListItems()[0].name);
       //console.log(response.items);
      }
    );/* */
    //------code addition for KPI Benchmark Drilldown Listview ends---------------
    


    
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new DataGridViewModel();
  }
);
