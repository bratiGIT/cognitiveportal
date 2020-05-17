/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your customer ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojmodel', 'ojs/ojvalidation-base', 'ojs/ojknockouttemplateutils', 'ojs/ojcollectiondatagriddatasource', 'ojs/ojarraydataprovider', 'ojs/ojcollectiondataprovider',
    'ojs/ojknockout', 'ojs/ojdatagrid', 'ojs/ojvalidation-number', 'ojs/ojbutton', 'ojs/ojdialog', 'ojs/ojpopup', 'ojs/ojlistview', 'ojs/ojnavigationlist', 'ojs/ojswitcher', 'ojs/ojcollapsible', 'ojs/ojoffcanvas', 'ojs/ojtable','ojs/ojlabel'
  ],
  function (oj, ko, $, app, Model, ValidationBase, KnockoutTemplateUtils, collectionModule, ArrayDataProvider, CollectionDataProvider) {

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

      //dhrajago addition begins
      //Clear Variables on fresh page load
      app.hideGlobalProgress();
      self.waitProgress = ko.observable(-1);
      self.kpiPrgrsVisible = ko.observable(false);
      self.cntrlPrgrsVisible = ko.observable(false);
      self.assetPrgrsVisible = ko.observable(false);
      //dhrajago addition ends

      self.connected = function () {
        // Implement if needed
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

      /*var jsonArr = [{
        "A. Strategy & Direct": {
            "Client Collaboration": ["Stakeholder Relationship Strategy", "Procurement Integration Strategy"] ,
            "Analytics": ["Cost Management Strategy", "Data Governance Strategy"],
            "Sourcing": ["Sourcing Strategy", "Supplier Selection Strategy", "Category Strategy", "Sourcing Schedule"],
            "Procurement Operations": ["Procurement Planning", "Supply Assurance", "Procurement Policy"],
            "Supplier Management": ["Contract & SLA Strategy", "Supplier Relationship Strategy"],
            "Invoice Processing": ["Invoice Policy", "Purchase Order Policy", "Advance Policy"],
            "Payment Processing": ["Payment Policy", "Tax Policies", "Corporate Credit-Card Policy", "Travel & Expense Policy"],
            "Administration": ["Business Planning", "Procedures", "Procurement IT Architecture"]
        } ,
        "B. Manage & Monitor": {
            "Client Collaboration": ["Stakeholder Relationship Management", "Requirements & Specification Management"],
            "Analytics": ["Requirements Analysis", "Spend Analysis", "Market Analysis", "Master Data Management"],
            "Sourcing": ["Supplier Validation", "Category Management"],
            "Procurement Operations": ["Purchase Order Management"],
            "Supplier Management": ["Supplier Master Management", "Supplier Portfolio Management", "Supplier Performance Management", "Supplier Onboarding", "Category Management", "SLA (Service Level Agreement) Management"],
            "Invoice Processing": ["Invoice Approvals", "Exception Approvals", "Goods Receipt Notifications", "Reconciliation", "PO/Invoice/Receipt Matching"],
            "Payment Processing": ["Travel & Expense Approvals", "Tax Management", "Bank Clearing Reconciliations", "Payment Authorization", "Advance Payments Approvals", "Duplicate Payment Detection & Prevention"],
            "Administration": ["Risk Management & Fraud Detection", "Policy Monitoring"]
        },
        "C. Execute & Deliver": {
            "Client Collaboration": ["Stakeholder Needs Validation", "Stakeholder Relationship Operations"],
            "Analytics": ["TCO (Total Cost of Ownership) Analysis", "Cost & Benefit Analysis", "Cost Monitoring & Management", "Reporting"],
            "Sourcing": ["Supplier Selection", "SLA (Service Level Agreement) Creation", "Price & Contract Negotiation", "Contract Management", "Savings Realization"],
            "Procurement Operations": ["Requisition Management", "Order Expedition", "Goods & Services Receipt"],
            "Supplier Management": ["Supplier Master Setup & Management", "Supplier Relationship Management", "Monitor Quality", "Help Desk Operations"],
            "Invoice Processing": ["Invoice Receipt & Scanning", "Invoice Posting", "Invoice Query & Validation", "Pre-Payment Processing", "Exception Invoice Handling", "Accrual Accounting"],
            "Payment Processing": ["Payment Processing Setup", "Payment Processing Execution", "Payment Exception Management", "Expense Reimbursements", "Discount Management"],
            "Administration": ["Skills & Education", "IT Maintenance", "Catalog Operations", "Supplier Data Maintenance"]
        } 
      }];
      console.log(jsonArr)*/

      /* var newJsonArr = [];
        var maxLengthArr = [];
        var rowHeaderArr = [];
        var i = 0;
        var comps = jsonArr[0];
        //console.log(comps);
        var maxLength = 0;
        for(var j in comps)
        {
            var cellsArr = comps[j];
            //console.log(cellsArr)
            rowHeaderArr.push(j);
            for(var k in cellsArr)
            {
                maxLength = Math.max(maxLength, cellsArr[k].length);
                i++;
            }
            maxLengthArr.push(maxLength);
            //console.log(maxLength);
        }        
      console.log(maxLengthArr);

      var k = 0;
      var l = 0;
      for(var r in comps)
        {
            var aLen = maxLengthArr[k];
            //console.log(aLen);
            var t = 0;
            for(var j=0; j<aLen; j++)
            {
                newJsonArr[l] = [];
                newJsonArr[l].push({'ROWHEADER':rowHeaderArr[k]});
                              
                var cellsArr = comps[r];
                console.log(cellsArr);
                var p = 1;
                for(var c in cellsArr)
                {   
                    var cell = cellsArr[c];
                    var obj = {};
                    var n = aLen/cell.length;
                    console.log(t+", "+(p-1)+", "+n);
                    
                    var l2process_val = cell[t];
                    console.log(l2process_val);  
                    obj["L2PROCESS"+p] = l2process_val;
                    newJsonArr[l].push(obj);  

                    if((p-1)==cell.length) t++;
                    if(n==1) t++;
                    p++;
                }
                l++;
            }
            k++;
        }
        console.log(newJsonArr);  */

      //dhrajago addition begins
      console.log("dataGrid::Load Data Grid::Begins");
      this.KnockoutTemplateUtils = KnockoutTemplateUtils;
      var collection = new Model.Collection(null, {
        url: '../../json/grid.json'
      });

      collectionModule.CollectionCellSet.prototype.getExtent = function (indexes) {
        return {
          'row': this._getExtentHelper(indexes, 'row'),
          'column': this._getExtentHelper(indexes, 'column')
        };
      };

      // a helper method to get the extent of a particular axis
      collectionModule.CollectionCellSet.prototype._getExtentHelper = function (indexes, axis) {
        var index = indexes[axis];
        if ((index === 0 || index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6) && axis == 'column') {
          var extent = 1;
        }
        /* else if ((index === 0 || index === 1) && axis == 'row')
        {
            var extent = 1;
        } */
        else if ((indexes['column'] === 1) && (indexes['row'] === 1 || indexes['row'] === 2 || indexes['row'] === 2 || indexes['row'] === 3 || indexes['row'] === 4 || indexes['row'] === 5 || indexes['row'] === 6 || indexes['row'] === 7)) {
          var extent = 2;
        } else if ((indexes['column'] === 2) && (indexes['row'] === 0 || indexes['row'] === 1 || indexes['row'] === 8 || indexes['row'] === 9)) {
          var extent = 2;
        } else if ((indexes['column'] === 2) && (indexes['row'] === 2 || indexes['row'] === 3 || indexes['row'] === 4 || indexes['row'] === 5 || indexes['row'] === 6 || indexes['row'] === 7)) {
          var extent = 3;
        } else if ((indexes['column'] === 3) && (indexes['row'] === 0 || indexes['row'] === 1 || indexes['row'] === 2 || indexes['row'] === 3 || indexes['row'] === 4 || indexes['row'] === 5 || indexes['row'] === 6 || indexes['row'] === 7 || indexes['row'] === 8 || indexes['row'] === 9)) {
          var extent = 2;
        } else {
          var extent = 1;
        }

        var start = this._getStartIndex(indexes, axis);
        var end = start + extent - 1;
        var before = false;
        var after = false;

        var axisStart = axis == 'row' ? this.startRow : this.startCol;
        var axisEnd = axis == 'row' ? this.endRow - 1 : this.endCol - 1;

        if (start < axisStart) {
          // Need to subtract this overage from the extent
          extent -= (axisStart - start);
          before = true;
        }
        if (end > axisEnd) {
          // true extent overruns the header set--adjust it down by that much
          extent -= (end - axisEnd);
          after = true;
        }
        return {
          'extent': extent,
          'more': {
            'before': before,
            'after': after
          }
        };
      };

      collectionModule.CollectionCellSet.prototype._getStartIndex = function (indexes, axis) {
        var index = indexes[axis];
        //console.log(index, axis)
        /* if ((index === 0 || index === 1) && axis == 'column')
        {
            return 0;
        }
        if ((index === 2 || index === 3) && axis == 'row')
        {
            return 1;
        }
        if ((indexes['column'] === 3 || indexes['column'] === 4) && (indexes['row'] === 5 || indexes['row'] === 6))
        {
            return axis === 'column' ? 3 : 5;
        } */
        return index;
      };

      /* collectionModule.CollectionCellSet.prototype.getData  = function(indexes)
      {
        return (indexes.row + 1) + ',' + (indexes.column + 1);
      }; */

      var options = {
        //'rowHeader': 'ROWHEADER',
        'columns': ['L2PROCESS1', 'L2PROCESS2', 'L2PROCESS3', 'L2PROCESS4', 'L2PROCESS5', 'L2PROCESS6']
      };

      this.dataSource = ko.observable();
      this.dataSource(new collectionModule.CollectionDataGridDataSource(collection, options));
      //console.log(this.dataSource)

      /*this.dataSource = new collectionModule.CollectionDataGridDataSource(collection, 
       {rowHeader: 'ROWHEADER'}); */

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

      this.columnHeaderStyle = function (headerContext) {
        var column = headerContext['key'];
        if (column === 'L2PROCESS6') {
          return 'width:189px;height:50px;background: linear-gradient(to bottom, #99ccff 0%, #003366 30%);font-size:12px;font-weight:bold';
        }
        return 'width:140px;height:50px; background: linear-gradient(to bottom, #99ccff 0%, #003366 30%);font-size:12px;font-weight:bold';
      };

      this.rowHeaderStyle = function (headerContext) {
        var row = headerContext['key'];
        //console.log(headerContext)
        /* if(headerContext['index']==0 || headerContext['index']==1 || headerContext['index']==2 || headerContext['index']==4 || headerContext['index']==5 || headerContext['index']==6 || headerContext['index']==7 || headerContext['index']==8 || headerContext['index']==10 || headerContext['index']==11 || headerContext['index']==12 || headerContext['index']==13 || headerContext['index']==14) 
        {
            return 'width:150px;height:50px;background-color:#b3b3b3;font-size:12px;font-weight:bold;border-bottom-width:0px;text-align:center;';
        } */
        return 'width:150px;height:50px;background-color:#b3b3b3;font-size:12px;font-weight:bold;text-align:center;';
      };

      this.rowHeaderRenderer = function (headerContext) {
        //console.log(headerContext);
        var value = headerContext['data'];
        if (headerContext['index'] == 1 || headerContext['index'] == 2 || headerContext['index'] == 3 || headerContext['index'] == 5 || headerContext['index'] == 6 || headerContext['index'] == 7 || headerContext['index'] == 8 || headerContext['index'] == 9 || headerContext['index'] == 11 || headerContext['index'] == 12 || headerContext['index'] == 13 || headerContext['index'] == 14 || headerContext['index'] == 15) {
          value = "";
        }
        var container = document.createElement('div');
        container.className = 'demo-content-container';
        container.appendChild(document.createTextNode(value));

        return {
          'insert': container
        }
      };

      this.cellClassName = function (cellContext) {
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
      this.cellColorHighlight = function (cellContext) {
        var column = cellContext['keys']['column'];
        //console.log(cellContext)
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
        //$('div#ui-id-19').css('height','90px');
        var num = 500 / 6;
        var ht = num.toFixed(0);
        if (cellContext['indexes']['row'] === 0 && cellContext['indexes']['column'] === 1) {
          //console.log(ht);
          return 'max-height:' + ht + 'px;font-size:10px;text-align:center;font-weight:bold;';
        }
        /* else if(cellContext['data']=="")
        {
          return 'display:none;'
        } */
        else {
          //return 'background-color:#e6ecff;height:40px;font-size:10px;text-align:center;font-weight:bold;';
          return 'width:150px;height:50px;font-size:10px;font-weight:bold;text-align:center;';
        }
      }
      this.popOutSelection = function (cellContext) {
        console.log(cellContext);
        if (cellContext.detail.value != undefined) {
          var d = cellContext.detail.value.indexes;
          if (cellContext.detail.value.type == 'cell' && d.row === 0 && d.column === 3) {
            return 'background-color:blue;'
          }
        }
      }
      //dhrajago addition ends

      //dhrajago addition for popup begins
      this.closeBizCompDialog = function (event) {
        document.getElementById('bizCompDialog').close();
      }

      this.openBizCompDialog = function (event) {
        document.getElementById('bizCompDialog').open();
      }

      this.closeLeadPractDialog = function (event) {
        document.getElementById('leadingPracticeDialog').close();
      }

      this.openLeadPractDialog = function (event) {
        document.getElementById('leadingPracticeDialog').open();
      }
      //dhrajago addition for popup ends


      //Header Level tab addition code begins
      this.selectedItem = ko.observable("info");
      this.currentEdge = ko.observable("top");
      //Header Level tab addition code ends


      //Popup (BizComp) Level tab addition code begins
      this.selectedCompItem = ko.observable("benchmark");
      this.compTabEdge = ko.observable("top");
      //Popup (BizComp) Level tab addition code ends

      //Popup (BizComp) set Header region attributes begins
      self.selectedBizCompName = ko.observable("Supplier Onboarding");
      self.selectedBizCompDesc = ko.observable("Supplier Onboarding covers all the operating procedures to engage with and put into operation the new suppliers once they have been approved and validated");
      //Popup (BizComp) set Header region attributes ends


      //------code addition for Component Menu Drilldown begins-------------
      var defaultHeader = "Business Component";
      this.setDialogTitle = ko.observable(defaultHeader);



      //Region Rendering Flag
      this.showCommonRegion = ko.observable(true);
      this.showBenchmarkRegion = ko.observable(false);
      this.showControlRegion = ko.observable(false);
      this.showCogRpaAssetRegion = ko.observable(false);

      // Array Data for Business Component List View
      var data = [{
          id: 0,
          name: 'Benchmarks',
          content: 'Benchmark KPI Data'
        },
        {
          id: 1,
          name: 'Controls & Risks',
          content: 'Controls & Risks section to be included'
        },
        {
          id: 2,
          name: 'Cognitive RPA Assets',
          content: 'Cognitive / RPA Asset section to be included'
        },
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
          //console.log("dataGrid::Event Click Capturing event row");
          //console.log(row);

          switch (row.id) {
            //Benchmark
            case 0:
              this.showCommonRegion(false);
              this.showBenchmarkRegion(true);
              this.showControlRegion(false);
              this.showCogRpaAssetRegion(false);
              this.content(row.content);
              break;
              //Controls
            case 1:
              this.showCommonRegion(false);
              this.showBenchmarkRegion(false);
              this.showControlRegion(true);
              this.showCogRpaAssetRegion(false);
              this.content(row.content);
              break;
              //Cognitive RPA Assets
            case 2:
              this.showCommonRegion(false);
              this.showBenchmarkRegion(false);
              this.showControlRegion(false);
              this.showCogRpaAssetRegion(true);
              this.content(row.content);
              break;
              //Default content for all tabs except Benchmark currently
            default:
              this.showCommonRegion(true);
              this.showBenchmarkRegion(false);
              this.showControlRegion(false);
              this.showCogRpaAssetRegion(false);
              this.content(row.content);
          }

          console.log("dataGrid::Drilldown::Common Region Rendered =>" + this.showCommonRegion());
          console.log("dataGrid::Drilldown::Benchmark Region Rendered Flag => " + this.showBenchmarkRegion());
          console.log("dataGrid::Drilldown::Control Region Rendered Flag => " + this.showControlRegion());
          console.log("dataGrid::Drilldown::Cognitive RPA Asset Region Rendered Flag => " + this.showCogRpaAssetRegion());

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
      /*
      this.kpiDataProvider = ko.observable();
      this.kpiCollection = null;
      self.kpiServiceURL = ko.observable("../../json/kpi.json");
      //var kpiRestUri = "http://129.150.172.40:8080/ords/portal_workspace/xxibm_portal_mstr_data_view/xxibm_portal_mstr_ibv_kpi_view_get";
      self.kpiServiceURL("http://129.150.172.40:8080/ords/portal_workspace/xxibm_portal_mstr_data_view/kpiTest");
      console.log("KPI Service URI: "+self.kpiServiceURL());
      
      var model = Model.Model.extend({
          idAttribute: 'kpi_id'
      });

      var kpiCollection = new Model.Collection(null, {
          url: self.kpiServiceURL(),//server.getURL(),
          //used to generate authentication and config headers
          //customURL: self.getHeaders(),
          //headers:{INDUSTRY_VAR: "IND003",RECORD_ID_VAR:"66"},
          //fetchSize: 15,
          model: model,
          comparator: "kpi_id"
      });

      this.kpiCollection = kpiCollection;
      this.kpiDataProvider(new CollectionDataProvider(kpiCollection));
      */

      /*
      // Populating an observable array with data from 
      self.kpiListItems = ko.observableArray();
      self.kpiCollection.fetch().then(
        function(response)
        {
         console.log("1-Inside kpiCollection fetch method");
         
         self.kpiListItems(response);
         console.log(self.kpiListItems()[0].name);
         //console.log(response.items);
        }
      );
      */
      //------code addition for KPI Benchmark Drilldown Listview ends---------------

      //-------code to invoke REST services begins--------------
      /*
      $.getJSON(self.kpiServiceURL())
          .done(function (result) 
           {
              console.log("Inside get JSON");
              console.log(result.items);
              //var abc = new oj.CollectionDataProvider(result.items, {idAttribute : "kpi_id"});
              //this.kpiDataProvider(abc);
           }
        ).fail(function () {
          errors.push(0); 
          reject(errors);
      }
      );
      */

      //AJAX Call
      // Generate authorization headers to inject into rest calls
      // self.currConvRate = ko.observable("1"); 
      // self.currConvRate(sessionStorage.getItem("currConvRate"));
      //console.log("****************Currnecy Rate is.===>"+self.currConvRate());
      self.getHeaders = function () {
        //var currConvRate = sessionStorage.getItem("currConvRate");
        /*
        if (currConvRate === null) {
          currConvRate = 1;
          console.log("Currnecy Rate was null. Setting to 1");
        }
        */
        //console.log("dataGrid::KPI REST Service call:: Conversion Rate =>" + currConvRate);
        return {
          'headers': {
            //'Authorization': 'Bearer ' + self.token(),
            INDUSTRY_VAR: 'IND002'
           ,RECORD_ID_VAR: 'E10'//'B1' //'66'
           ,CONV_RATE_VAR: app.currConvRate()//String(currConvRate) //'71.236'
          }
        };
      };


      var kpiRestUri = "http://129.150.172.40:8080/ords/portal_workspace/xxibm_portal_mstr_data_view/xxibm_portal_mstr_ibv_kpi_view_get";
      var corsBypassUri = "https://cors-anywhere.herokuapp.com/";
      //CORS Workaround begins
      self.queryURL = ko.observable(corsBypassUri + kpiRestUri);
      self.kpiResponse = ko.observableArray([]);
      self.kpiAjaxDataProvider = ko.observable();
      //app.showGlobalProgress();
      self.kpiPrgrsVisible(true);
      //CORS workaround ends
      $.ajax({
        type: "GET",
        headers: self.getHeaders().headers,
        url: self.queryURL(),
        success: function (res) {
          console.log("dataGrid::KPI REST Service Callout::Inside AJAX");

          self.kpiResponse(res.items);
          self.kpiAjaxDataProvider(new ArrayDataProvider(self.kpiResponse(), {
            keys: self.kpiResponse().map(function (value) {
              return value.kpi_id;
            })
          }));
          //app.hideGlobalProgress();
          self.kpiPrgrsVisible(false);
        },
        failure: function (jqXHR, textStatus, errorThrown) {
          console.log("dataGrid::KPI REST Service Callout::Inside AJAX");
          console.log(errorThrown);
          alert(textStatus);
        }
      });
      //----code for REST service callout ends-------------

      //------code addition for Controls Drilldown Listview begins---------------
      self.cntrlPrgrsVisible(true);
      self.setCntrlCustomHdr = function (operation, collection, options) {
        var retObj = {};
        if (operation === 'read') {
          //retObj['headers'] = {'prUrl': self.prUrl, 'pr-authoriztion': self.prAuthEncoded};
          retObj['headers'] = {
            'RECORD_ID_VAR': "E7"
          };
          retObj['mimeType'] = "text/plain";
        }
        return retObj;
      };

      this.cntrlRgnDataProvider = ko.observable();
      this.cntrlCollection = null;
      self.cntrlServiceURL = ko.observable("../../json/control.json");
      self.cntrlServiceURL(corsBypassUri + "http://129.150.172.40:8080/ords/portal_workspace/xxibm_portal_controls_risks/xxibm_portal_controls_risks_get/");

      console.log("dataGrid::Control Service URI: " + self.cntrlServiceURL());

      var cntrlModel = Model.Model.extend({
        idAttribute: 'cid'
      });

      var cntrlCollection = new Model.Collection(null, {
        url: self.cntrlServiceURL(),
        customURL: self.setCntrlCustomHdr,
        model: cntrlModel,
        comparator: "cid",
        parse : function(success){
          self.cntrlPrgrsVisible(false);
        }
      });

      this.cntrlCollection = cntrlCollection;
      this.cntrlRgnDataProvider(new CollectionDataProvider(cntrlCollection));
      //self.cntrlPrgrsVisible(false);
      //------code addition for Controls Drilldown Listview ends---------------



      //------code addition for Cognitive RPA Asset Drilldown Listview begins---------------
      self.assetPrgrsVisible(true);
      this.cogRpaAssetDataProvider = ko.observable();
      this.cogRpaAssetCollection = null;
      self.cogRpaAssetSrvcURL = ko.observable("../../json/asset.json");
      self.cogRpaAssetSrvcURL(corsBypassUri + "http://129.150.172.40:8080/ords/portal_workspace/xxibm_portal_rpa_assets/xxibm_portal_rpa_assets_get/");
      console.log("dataGrid::Cognitive RPA Asset Service URI: " + self.cogRpaAssetSrvcURL());

      var cogRpaAssetModel = Model.Model.extend({
        idAttribute: 'aid'
      });

      var cogRpaAssetCollection = new Model.Collection(null, {
        url: self.cogRpaAssetSrvcURL(),
        customURL: self.setCntrlCustomHdr,
        model: cogRpaAssetModel,
        comparator: "aid"
      });

      this.cogRpaAssetCollection = cogRpaAssetCollection;
      this.cogRpaAssetDataProvider(new CollectionDataProvider(cogRpaAssetCollection));
      self.assetPrgrsVisible(false);
      //------code addition for Cognitive RPA Asset Drilldown Listview ends---------------

      //---------- code addition for Leading Practices begins ----------------------------
      self.leadPractArray = ko.observableArray([]);
      self.leadingPracticeDP = ko.observable();
      self.leadPractArray(
        [{
            "cmptId": "1",
            "cmptName": "Sourcing",
            "process": "Procurement Strategy and Sourcing",
            "aware": ["Decentralized procurement strategy", "Decentralized sourcing strategy"],
            "dvlp": ["Centralized procurement and sourcing strategy", "Pre-identified purchasing arrangements with key vendors"],
            "prctc": ["Formal procurement plan documented and communicated", "Procurement and sourcing procedures leverage quantity discounts", "Centrally maintained supplier catalogs"],
            "optmz": ["sourcing via predefined web portals and micro sites utilizing electronic auctions and request for quotes", " Sourcing strategy well documented and adhered to"],
            "lead": ["Procurement strategy integrated with corporate strategy", "Automated distribution of sourcing strategies, policies, and procedures"]
          },
          {
            "cmptId": "2",
            "cmptName": "Supplier Management",
            "process": "Vendor and Supplier Management",
            "aware": ["Mandatory collection of vendor information for tax reporting purposes", "Multiple supplier databases"],
            "dvlp": ["Informal supplier selection process", "Informal supplier performance monitoring"],
            "prctc": ["Single supplier database", "Centralized governance of supplier selection.", "Supplier performance standards established", "Automated and centralized regulatory compliance reporting"],
            "optmz": ["Consistent deployment of supplier selection process across select business units", "Manual monitoring of supplier performance", "Centrally managed procurement cards"],
            "lead": ["Consistent deployment of supplier selection process across the entire corporation", "Performance metrics jointly defined with suppliers", "Automated monitoring of supplier performance", "Vendor Self-Service"]
          }
        ]);

      //self.leadingPracticeDP = new ArrayDataProvider(self.leadPractArray(), {keyAttributes: 'compid'});
      self.leadingPracticeDP(new ArrayDataProvider(self.leadPractArray(), {
        keys: self.leadPractArray().map(function (value) {
          return value.compid;
        })
      }));



      this.leadPractColumnArray = [
        /*{"headerText": "Competency",
                               "renderer": KnockoutTemplateUtils.getRenderer("cname", true), 
                               "sortable": "disabled"},*/
        {
          "headerText": "Component",
          "sortable": "enabled",
          "renderer": KnockoutTemplateUtils.getRenderer("process", true),
          "sortProperty": "process",
          "style": "white-space:normal;word-wrap:break-word;text-align: left;vertical-align: top;"
        }, {
          "headerText": "Aware",
          "renderer": KnockoutTemplateUtils.getRenderer("aware", true),
          "sortable": "disabled",
          "style": "white-space:normal;word-wrap:break-word;text-align: left;vertical-align: top;"
        },
        {
          "headerText": "Developing",
          "renderer": KnockoutTemplateUtils.getRenderer("dvlp", true),
          "sortable": "disabled",
          "style": "white-space:normal;word-wrap:break-word;text-align: left;vertical-align: top;"
        },
        {
          "headerText": "Practicing",
          "renderer": KnockoutTemplateUtils.getRenderer("prctc", true),
          "sortable": "disabled",
          "style": "white-space:normal;word-wrap:break-word;text-align: left;vertical-align: top;"
        },
        {
          "headerText": "Optimizing",
          "renderer": KnockoutTemplateUtils.getRenderer("optmz", true),
          "sortable": "disabled",
          "style": "white-space:normal;word-wrap:break-word;text-align: left;vertical-align: top;"
        },
        {
          "headerText": "Leading",
          "renderer": KnockoutTemplateUtils.getRenderer("lead", true),
          "sortable": "disabled",
          "style": "white-space:normal;word-wrap:break-word;text-align: left;vertical-align: top;"
        }
      ];

      //---------- code addition for Leading Practices ends ------------------------------


    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new DataGridViewModel();
  }
);