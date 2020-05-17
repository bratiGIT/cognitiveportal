/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your customer ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojmodel', 'ojs/ojmodule-element-utils','ojs/ojvalidation-base', 'ojs/ojknockouttemplateutils', 'ojs/ojcollectiondatagriddatasource', 'ojs/ojarraydataprovider','ojs/ojarraytreedataprovider','ojs/ojcollectiondataprovider', 'ojs/ojarraydatagriddatasource', 'restModule',  'ojs/ojknockout', 'ojs/ojdatagrid', 'ojs/ojvalidation-number', 'ojs/ojbutton', 'ojs/ojdialog', 'ojs/ojpopup', 'ojs/ojlistview', 'ojs/ojnavigationlist', 'ojs/ojswitcher',
 'ojs/ojcollapsible', 'ojs/ojoffcanvas', 'ojs/ojtable','ojs/ojlabel','ojs/ojgauge','ojs/ojradioset','ojs/ojlegend'
  ],
  function (oj, ko, $, app, Model, moduleUtils , ValidationBase, KnockoutTemplateUtils, collectionModule, ArrayDataProvider,ArrayTreeDataProvider, CollectionDataProvider,arrayModule,restModule) {

    function DataGridViewModel() {
      var self = this;
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      //Instantiate Variables
      app.hideGlobalProgress();
      self.waitProgress = ko.observable(-1);

      self.selectedItem = ko.observable("info");
      self.currentEdge = ko.observable("top");
      
      self.leadingPracticeDialogTitle = ko.observable("Leading Practices");

      self.dataGridPrgrsVisible = ko.observable(true);
      self.dataGridProgress = ko.observable(false);
      self.myObservableArray = ko.observableArray([]);
      self.dataSource = ko.observable();
      self.competencyRegionDialogTitle = ko.observable("Competency Details");
      self.orgChartDialogTitle = ko.observable("Organization Hierarchy");
      this.selectedItemKpi = ko.observable("kpi");
      this.currentEdgeKpi = ko.observable("top");
      self.competencyName = ko.observable("");
      self.selectedCompetencyCellId = ko.observable("");
      self.selectedCompetencyId = ko.observable("");
      self.selectedBizCompCellId = ko.observable("");
      self.gridPageHeader = ko.observable("Procurement Management");

      //Popup (BizComp) set Header region attributes begins
      self.selectedBizCompName = ko.observable("");
      self.selectedBizCompDesc = ko.observable("");
      self.selectedBizCompId = ko.observable("");
      var defaultHeader = "Business Component";
      self.setDialogTitle = ko.observable(defaultHeader);
      //Popup (BizComp) set Header region attributes ends

      //Popup (BizComp) Level tab addition code begins
      self.selectedCompItem = ko.observable("benchmark");
      self.compTabEdge = ko.observable("top");
      //Popup (BizComp) Level tab addition code ends

      self.gridWidth = ko.observable("100%");
      self.gridHeight = ko.observable("1000px");
      self.noOfCols = 0;

      self.setGridHeader = function(){
        // switch(app.selectedDomainCode())
        // {
        //   //Benchmark
        //   case "DOM001":
        //     self.gridPageHeader("Procurement Management"); 
        //     break;
        //   case "DOM002":
        //     self.gridPageHeader("Finance Management"); 
        //     break;
        //   case "DOM003": 
        //     self.gridPageHeader("Human Capital Management");  
        //     break;
        //   //Default Header
        //   default: 
        //   self.gridPageHeader("Procurement Management");
        // }
        self.gridPageHeader(app.selectedIndustryTxt()+' > '+app.selectedDomainTxt());
      };
      
      /**Set Data Grid Header based on Context */
      self.setGridHeader();

      /*Legend for Core (Heatmap) View
      var cognitiveLevels = [{level: "High"}, {level: "Medium"},{level: "Low"}];
      self.heatMapLegend = new ArrayDataProvider(cognitiveLevels, {keyAttributes: 'level'});
      */

      console.log("[dataGrid]: Instantiate Leading Practices Module");
      /**Leading Practices - Start*/
      self.leadingPrctseConfig = ko.observable({'view':'','viewModel':''});
      self.leadingPracticesModuleCreate = function() {
        var leadingPrctiseModLoad = Promise.all([
          moduleUtils.createView({'viewPath':'views/leadingPractices.html'}),
          // moduleUtils.createViewModel({'viewModelPath':'viewModels/leadingPractices','initialize':'always'})
          moduleUtils.createViewModel({'viewModelPath':'viewModels/leadingPractices',cleanupMode:'onDisconnect'})
        ]);
        leadingPrctiseModLoad.then(
          function(values){
            self.leadingPrctseConfig({'view':values[0],'viewModel':values[1]});
          }
        );
      };
      /**Leading Practices - End*/

      /**Org chart -- start */
      /* this.closeOrgChartDialog = function (event) {
        document.getElementById('orgChartDialog').close();
      }

      this.openOrgChartDialog = function (event) {
        self.prepareLeadingPracticesData();
        document.getElementById('orgChartDialog').open();
      } */
      console.log("[dataGrid]: Instantiate Org chart Module");
      self.orgHeirarchyConfig = ko.observable({'view':'','viewModel':''});
      self.orgHeirarchyModuleCreate = function() {
        var orgHeirarModLoad = Promise.all([
          moduleUtils.createView({'viewPath':'views/orgHeirarchy.html'}),
          moduleUtils.createViewModel({'viewModelPath':'viewModels/orgHeirarchy','initialize':'always'})
        ]);
        orgHeirarModLoad.then(
          function(values){
            self.orgHeirarchyConfig({'view':values[0],'viewModel':values[1]});
          }
        );
      };
      /**Org chart -- end */

      /**Rapid move -- start */
      console.log("[dataGrid]: Rapid Move Module");
      self.rapidMoveConfig = ko.observable({'view':'','viewModel':''});
        var rpdMovModLoad = Promise.all([
          moduleUtils.createView({'viewPath':'views/rapidMove.html'}),
          moduleUtils.createViewModel({'viewModelPath':'viewModels/rapidMove','initialize':'always'})
        ]);
        rpdMovModLoad.then(
          function(values){
            self.rapidMoveConfig({'view':values[0],'viewModel':values[1]});
            console.log(self.rapidMoveConfig);
          }
        );
      /**Rapid move -- end */
      
      /**Competency Details - Start*/
      console.log("[dataGrid]: Instantiate Competency Details Module");
       self.competencyDetailsConfig = ko.observable({'view':'','viewModel':''});
       self.competencyModuleCreate = function(){  
       var competencyDetailsModLoad = Promise.all([
         moduleUtils.createView({'viewPath':'views/competencyDetails.html'}),
         moduleUtils.createViewModel({'viewModelPath':'viewModels/competencyDetails','initialize':'always','params':{selectedCmptncyName: self.competencyName(),selectedCmptncyId: self.selectedCompetencyId()}})
       ]);
       competencyDetailsModLoad.then(
         function(values){
           self.competencyDetailsConfig({'view':values[0],'viewModel':values[1]});
         }
       );
      };
      /**Competency Details - End*/

      //dakshayani changes begins
      self.currentBtn = ko.observable("classic");
      self.btnOptions = ko.observableArray([
        {id:"classic", value: "classic", btn: "Standard", cls: "sidebar_switch_button2"},
        {id:"core", value: "core", btn: "Heat Map", cls: "sidebar_switch_button1"}
      ]);
      self.selectedCoreClassic = ko.observable("classic");
      
      self.valueChangeHandler = function (event) {
        self.selectedCoreClassic = event['detail'].value;
        //Refresh datagrid on core/classic button selection
        document.getElementById("datagrid").refresh();
      };
      //dakshayani changes end

      this.bizCompDialogCloseHandler = function (event,ui) {
        //console.log(event,ui);
        $("#"+self.selectedBizCompCellId()).toggleClass("oj-selected oj-focus oj-datagrid-selected-top oj-datagrid-selected-bottom");
        if(self.selectedCompetencyCellId()!="")
        {
          $("#"+self.selectedCompetencyCellId()).toggleClass("oj-focus");
        }
        self.selectedBizCompCellId("");
      }.bind(this);

      //-----------code addition for Competency Details begins-------------
      this.competencyDialogCloseHandler = function (event,ui) {
        //console.log(event,ui);
        $("#"+self.selectedCompetencyCellId()).toggleClass("oj-focus");
        if(self.selectedBizCompCellId()!="")
        {
          $("#"+self.selectedBizCompCellId()).toggleClass("oj-selected oj-focus oj-datagrid-selected-top oj-datagrid-selected-bottom");
        }
        self.selectedCompetencyCellId("");
      }.bind(this);
      //-----------code addition for Competency Details ends--------------
      
      //dakshayani changes begins
      function ArrayDataGridDataSource(data, options) {
        this.rowHeaderKey = this._getRowHeaderFromOptions(options);
      
        if (options != null) {
          // undefined if no row header, 'm_defaultIndex' if indexed, other strings keys, numbers index of array
          this.columns = options.columns;
          //this.sortCriteria = options.initialSort;
        }
        ArrayDataGridDataSource.superclass.constructor.call(this, data);
      };

      arrayModule.ArrayCellSet.prototype.getExtent  = function(indexes)
      {
        return {'row': this._getExtentHelper(indexes, 'row'), 'column': this._getExtentHelper(indexes, 'column')};
      };                
      
      // a helper method to get the extent of a particular axis
      arrayModule.ArrayCellSet.prototype._getExtentHelper  = function(indexes, axis)
      { 
          var index = indexes[axis];
          //Get position of current col and row in extentArr
          var pos = $.inArray(indexes['column']+","+indexes['row'], self.extentArr);

          if ((index === 0 || index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6) && axis == 'column')
          {
              var extent = 1;
          }
          /* else if ((index === 0 || index === 1) && axis == 'row')
          {
              var extent = 1;
          } */
          else if(axis == 'row' && pos>-1)
          {
            //console.log(self.extentValArr[pos]);
            var extent = self.extentValArr[pos];
          }
          else
          {
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
              extent -= (axisStart-start);
              before = true;
          }
          if (end > axisEnd) {
              // true extent overruns the header set--adjust it down by that much
              extent -= (end-axisEnd);
              after = true;
          }
          return {'extent':extent, 'more': {'before':before, 'after':after}};
      };

      arrayModule.ArrayCellSet.prototype._getStartIndex = function(indexes, axis)
      {
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

      arrayModule.ArrayDataGridDataSource.prototype._getRowHeaderFromOptions = function (options) {
        return undefined;
      };

      function getColorsVal(avg) {
        var val = 0;
        if(avg>0 && avg<=30) val = 1;
        else if(avg>30 && avg<=60) val = 2;
        else if(avg>60 && avg<=100) val = 3;
        return val;
      }
      
      self.colsArr = [];
      self.descArr = [];
      self.scoreavgArr = [];
      self.competencyIdArr = [];
      self.cmptIdArr = [];
      self.extentArr = [];
      self.extentValArr = [];

      function prepareDataSourceArray(responseItems) { 
        var newDataArr = [];
        var maxLength = 0;
        for(var i in responseItems)
        {
          var cellsArr = responseItems[i].cmptnt;
          //console.log(cellsArr);
          maxLength = Math.max(maxLength, cellsArr.length);
        }
        //console.log(maxLength);

        /* Setting grid height dynamically */
        console.log(self.noOfCols);
        var h = 70;
        var gh = 0;
        if (screen.height >= 720 && screen.height <= 864 )
        {
          if(self.noOfCols>=3 && self.noOfCols<=8) h = 50;
          if(self.noOfCols==9) h = 60;
          gh = (maxLength * h) + 90;
        }
        else if (screen.height == 900)
        {
          if(self.noOfCols>=3 && self.noOfCols<=8) h = 60;
          if(self.noOfCols==9) h = 65;
          gh = (maxLength * h) + 90;
        }
        else{
          if(self.noOfCols>=3 && self.noOfCols<=8) h = 60;
          if(self.noOfCols==9) h = 65;
          gh = (maxLength * h) + 90;
        }
        //console.log("Grid ht:"+gh);            
        self.gridHeight(gh+"px");

                
        for(var i=0; i<responseItems.length; i++){
          var dt = responseItems[i];
          var cdata = dt.cmptnt;
          self.colsArr.push(dt.cmptname);
          self.competencyIdArr.push(dt.cmptid);
          var col_arr = [];
          var arrLen = cdata.length;
          //console.log(arrLen)
          //var n = 1;
          var n = 0;
          var m = 0;
          var cLen = maxLength - arrLen;
          //console.log(maxLength+"-"+arrLen+"=>cLen="+cLen);
          //if(cLen==arrLen) n = 0;
          var v = parseInt(maxLength/arrLen).toFixed(0);
          var s = maxLength - (v * arrLen);
          for(var j=0; j<arrLen; j++)
          {
            if(arrLen<maxLength)
            {
              col_arr.push(cdata[j].val);  
              //if((j!=0 && j!=(arrLen-1) && cLen>0) || (cLen==arrLen)) 
              //console.log(j,cLen);
              //if(j!=(arrLen-1) && cLen>0 && cLen<arrLen)   //Commented for fixing Procurement CBM extents
              if(cLen>0 && cLen<=arrLen)
              {
                /* if(j==1) n = j;
                var cLen = (maxLength/arrLen).toFixed(0);
                //var eobj = {};
                for(var k=0; k<cLen-1; k++)
                {
                  if(j!=(arrLen-2))
                  { */
                    col_arr.push("");
                    cLen--;
                    self.extentArr.push(i+","+n);
                    self.extentValArr.push(2);
                    n = n + 2;
                    /* console.log("col="+i+",row="+n+",extent="+cLen);   
                    eobj[i+","+n] = cLen;
                    exArr.push(eobj);  
                    n = n + 2;
                  }
                } */
              }
              else if(cLen>arrLen)
              {
                for(var k=0; k<v-1; k++)
                {
                  col_arr.push("");
                }
                if(j!=(arrLen-1))
                {  
                  var extVal = parseInt(v);
                }
                else
                {  
                  var extVal = parseInt(v) + s;
                }
                self.extentArr.push(i+","+m);
                self.extentValArr.push(extVal);
                m = m + parseInt(v);          
              }
            }
            else
            {
              col_arr.push(cdata[j].val);    
            }
            self.descArr[cdata[j].val] = cdata[j].desc;
            self.scoreavgArr[cdata[j].val] = getColorsVal(cdata[j].scoreavg);          
            self.cmptIdArr[cdata[j].val] = cdata[j].id;      

          } // end for loop    

          if(cLen>arrLen)
          {      
            for(var k=0; k<s; k++)
            {
              col_arr.push("");
            }
          }

          newDataArr[i] = col_arr;
          //console.log(col_arr);
        }
        //console.log(newDataArr, self.colsArr, self.descArr, self.scoreavgArr, self.cmptIdArr);
        //console.log(self.extentArr, self.extentValArr);
        
        var obj = [];
        for(var k=0; k<maxLength; k++){
          var ndata = [];
          for(var i=0; i<newDataArr.length; i++)
          {  
            if(newDataArr[i][k]==undefined)
              ndata.push("");
            else
              ndata.push(newDataArr[i][k]);
          }
          obj[k] = ndata;
          //obj[self.colsArr[k]] = Object.assign({}, ndata);
        }
        //console.log(obj);
        return ko.observableArray(obj);
      }
      
      function prepareDataSource(rawcells) {
        return new arrayModule.ArrayDataGridDataSource(rawcells);
      }
      
      //--------dhrajago addition for datagrid REST service integration begins---------
      this.gridRgnDataProvider = ko.observableArray([]);
      self.cbmGridCollection = null;
      self.cbmGridServiceURL = ko.observable("http://129.150.172.40:8080/ords/portal_workspace/xxibm_portal_grid/fetchGridDataByDomain/");

      console.log("[dataGrid]:: Data Grid Service URI: " + self.cbmGridServiceURL());

      self.setGridCustomHdr = function (operation, collection, options) {
        var retObj = {};
        if (operation === 'read') {

          console.log("[dataGrid]:: Set Custom Header for Grid Service. Domain Code = "+app.selectedDomainCode())
          retObj['headers'] = {
           'DOM_CODE_VAR': app.selectedDomainCode() //"DOM001"
           ,'Authorization' : getLoggedInBtoa()
          };
          retObj['mimeType'] = "text/plain";
        }
        return retObj;
      };
      
      //Method to invoke the Grid REST Service
      self.prepareGridData = function () {
        self.dataGridPrgrsVisible(true);

        var cbmGridModel = oj.Model.extend({
          idAttribute: 'cmptid'
        });

        self.cbmGridCollection = oj.Collection.extend({
          url: self.cbmGridServiceURL(),
          customURL: self.setGridCustomHdr,
          model: cbmGridModel,
          comparator: "cmptid",
          // sync: self.cbmDataGridCollSync
        });

        self.cbmGridDataSource = new self.cbmGridCollection();

        console.log("[dataGrid]:: Grid REST :: Next to call fetch collection");
        //Call FetchMethod to load the dropdown
        self.cbmGridDataSource.fetch().then(
          function (success) {
            //console.log("[dataGrid]::Successful Grid Data Fetch");
            //console.log(success.items);

            /* Setting grid width dynamically */
            /* var numOfCols = success.items.length;
            self.noOfCols = numOfCols;
            var w = 100;
            
            if(numOfCols==3) w = 300;
            if(numOfCols==4) w = 225;
            if(numOfCols==5) w = 180;
            if(numOfCols==6) w = 165;
            if(numOfCols==7) w = 140;
            if(numOfCols==8) w = 120;
            if(numOfCols==9) w = 110;

            var gw = (numOfCols * w)+5;    
            //console.log("Grid wh:"+gw);        
            if(gw<=905) {
              self.gridWidth(gw+"px");
            } */
            
            /*
            var itemsArr =  [{
              "cmptname": "Policy & Strategy",
              "cmptid": "A",
              "cmptnt": [{
                "id": "A1",
                "val": "Sourcing Strategy",
                "desc": "Sourcing Strategy focusses on what is the best supplier segmentation for the given category, i.e. sole supplier, competing suppliers, primary, secondary supplier status, etc.",
                "scoreavg": 0
              }, {
                "id": "A10",
                "val": "Tax Policies",
                "desc": "Tax Compliance Policies defines tax compliance processes and creates a tax calendar including timelines and due dates.",
                "scoreavg": 0
              }, {
                "id": "A2",
                "val": "Category Strategy",
                "desc": "Category Strategy is the process of defining what are the best actions to take to maximize savings within a particular category of spend.",
                "scoreavg": 0
              }, {
                "id": "A3",
                "val": "Procurement Planning",
                "desc": "Procurement Planning ensures that all contributing factors and processes are identified and thorough PMO cadence are progressed to ensure an optimized and highly performing procurement function.",
                "scoreavg": 10
              }, {
                "id": "A4",
                "val": "Contract & SLA Strategy",
                "desc": "Contract & SLA Strategy involves selecting organization and contractual policies required for the execution of a communication vehicle for procurement and stakeholders to manage each other's expectations.",
                "scoreavg": 0
              }, {
                "id": "A5",
                "val": "Invoice Policy",
                "desc": "Invoice Policy outlines a set of policies and procedures for payment of supplier invoices.",
                "scoreavg": 0
              }, {
                "id": "A6",
                "val": "Purchase Order Policy",
                "desc": "Purchase Order Policy establishes and monitors the policies around the management and control of Purchase Orders.",
                "scoreavg": 0
              }, {
                "id": "A7",
                "val": "Payment Policy",
                "desc": "Payment Policy sets the governing rules for identifying and calculating the funds owed to stakeholder groups, the process by which the funds will be disbursed, and the organization that will undertake payments.",
                "scoreavg": 0
              }, {
                "id": "A8",
                "val": "Travel & Expense Policy",
                "desc": "Travel & Expense Policy establishes the proper alignment of people, process, and technology for the effective management and reporting of travel and expenses.",
                "scoreavg": 0
              }, {
                "id": "A9",
                "val": "Corporate Credit-Card Policy",
                "desc": "Corporate Credit Card Policy ensures that corporate credit cards are used for appropriate purposes and adequate controls are established for day-to-day use.",
                "scoreavg": 0
              }]
            }, {
              "cmptname": "Sourcing",
              "cmptid": "B",
              "cmptnt": [{
                "id": "B1",
                "val": "Supplier Selection & Validation",
                "desc": "Supplier selection sorts suppliers based on their capabilities with the objective of finding the best-in-class supplier for the particular commodity. Supplier Validation refers to the process of evaluating and approving potential suppliers by quantitative assessments.",
                "scoreavg": 70
              }, {
                "id": "B2",
                "val": "Category Management",
                "desc": "Sourcing Category Management is the methodology adopted by procurement to manage common types of purchases with a cohesive centralized method for the given category, this often includes consolidating supplier selection across the enterprise for the given category.",
                "scoreavg": 20
              }, {
                "id": "B3",
                "val": "SLA (Service Level Agreement) Creation",
                "desc": "SLA (Service Level Agreement) Creation involves the creation and implementation of the SLA to plan, monitor and control the procurement operation.",
                "scoreavg": 0
              }, {
                "id": "B4",
                "val": "Price & Contract Negotiation",
                "desc": "Price & Contract Negotiation refers to the process of give and take, covering details of price, payment terms and delivery, that the parties go through to reach an agreement.",
                "scoreavg": 0
              }, {
                "id": "B5",
                "val": "Contract Management",
                "desc": "Contract Management systematically and efficiently tracks and stores contracts for the purpose of maximizing financial and operational performance and minimizing risk.",
                "scoreavg": 70
              }, {
                "id": "B6",
                "val": "Savings Realization",
                "desc": "Procurement Savings Realization is the management of savings, from initial identification through to the identification of the realized savings on the organization's finance.",
                "scoreavg": 0
              }]
            }, {
              "cmptname": "Procurement Operations",
              "cmptid": "C",
              "cmptnt": [{
                "id": "C1",
                "val": "Requisition Management",
                "desc": "Requisition Management is critical front line operation of procurement function and is the mechanism used to capture individual needs and requirements.  The requisitions are reviewed and approved requistions are the basis of the PO.",
                "scoreavg": 30
              }, {
                "id": "C2",
                "val": "Purchase Order Management",
                "desc": "Purchase Order Management covers the lifecyle of a purchase order from when it is created to when it has been moved to closed status.  A purchase order is used to communicate authorized line item details of what has been approved for purchase.",
                "scoreavg": 38
              }, {
                "id": "C3",
                "val": "Order Expedition",
                "desc": "Order Expedition requests the vendor to acknowledge the receipt of the order and to indicate an expected shipping schedule.",
                "scoreavg": 20
              }, {
                "id": "C4",
                "val": "Goods & Services Receipt",
                "desc": "Goods & Services Receipt refers to a procedure on how to record receipt of goods and services directly on a purchase order.",
                "scoreavg": 0
              }]
            }, {
              "cmptname": "Supplier Management",
              "cmptid": "D",
              "cmptnt": [{
                "id": "D1",
                "val": "Supplier Onboarding",
                "desc": "Supplier Onboarding covers all the operating procedures to engage with and put into operation the new suppliers once they have been approved and validated.",
                "scoreavg": 60
              }, {
                "id": "D2",
                "val": "Supplier Master Management",
                "desc": "Supplier Master Management",
                "scoreavg": 60
              }, {
                "id": "D3",
                "val": "Supplier Relationship Management",
                "desc": "Supplier Relationship Management records the basic information about suppliers and their past and ongoing interactions, including performance.",
                "scoreavg": 0
              }, {
                "id": "D4",
                "val": "Supplier Performance Management",
                "desc": "Supplier Relationship Management is an objective way of assessing a suppliers performance. It is a method of measuring a suppliers actual performance against a set of agreed criteria (e.g. quality, delivery time, innovation potential, etc.). This component aims at maintaining and improving supplier performance and at assisting supplier development.",
                "scoreavg": 0
              }, {
                "id": "D5",
                "val": "Help Desk Operations",
                "desc": "Help Desk Operations supports end users, stakeholders and suppliers by giving advice on trouble shooting.",
                "scoreavg": 0
              }]
            }, {
              "cmptname": "Invoice Processing",
              "cmptid": "E",
              "cmptnt": [{
                "id": "E1",
                "val": "Invoice Receipt & Scanning",
                "desc": "Invoice Receipt & Scanning extracts data from the invoice receipt and sends the data into a system for matching against the purchase order.",
                "scoreavg": 60
              }, {
                "id": "E10",
                "val": "Cost & Benefit Analysis",
                "desc": "Cost and Benefit Analysis estimates the complete costs and benefits of different alternatives and is used to determine options that provide the best approach to achieve benefits while preserving savings.",
                "scoreavg": 0
              }, {
                "id": "E2",
                "val": "Goods Receipt Notifications",
                "desc": "Goods Receipt Notification includes a message to the buyer of the receipt of items physically received.",
                "scoreavg": 0
              }, {
                "id": "E3",
                "val": "PO/Invoice/Receipt Matching",
                "desc": "PO/Invoice/Receipt Matching covers all the steps involved from receiving PO, Invoices and the associated receipts, and the matching and analysis of these documents.",
                "scoreavg": 20
              }, {
                "id": "E4",
                "val": "Invoice Approvals",
                "desc": "Invoice Approvals list the steps and documents required before an invoice can be paid.",
                "scoreavg": 25
              }, {
                "id": "E5",
                "val": "Invoice Query & Validation",
                "desc": "Invoice Query & Validation involves following up queries in relation to invoices and the validation of all issues identified in relation to these invoices.",
                "scoreavg": 65
              }, {
                "id": "E6",
                "val": "Exception Invoice Handling",
                "desc": "Exception Invoice Handling involves invoices that cannot be automatically approved and are routed for exception handling through a workflow process that notifies buyers when invoices do not match the purchase order or notifies the end user when a non-PO invoice comes in that requires the user's approval.",
                "scoreavg": 0
              }, {
                "id": "E7",
                "val": "Invoice Posting",
                "desc": "Invoice Posting links the invoice amount to the supplier and to the expense account associated with the invoice.",
                "scoreavg": 20
              }, {
                "id": "E8",
                "val": "Accrual Accounting",
                "desc": "Accrual Accounting records revenues and expenses when they are incurred, regardless of when cash is exchanged.",
                "scoreavg": 20
              }, {
                "id": "E9",
                "val": "Reconciliation",
                "desc": "Reconciliation reviews preliminary trial balance and adjustments, and performs final review of P&L and balance sheets.",
                "scoreavg": 0
              }]
            }, {
              "cmptname": "Employee Expense & Payment Processing",
              "cmptid": "F",
              "cmptnt": [{
                "id": "F1",
                "val": "Expense Reimbursements",
                "desc": "Processing advancements and reimbursements for employee travel and expenses on the organization's behalf.",
                "scoreavg": 30
              }, {
                "id": "F10",
                "val": "Bank Clearing Reconciliations",
                "desc": "Bank Clearing Reconciliations reconciles cash balances between the company's records and those provided by the financial institution, monitoring bank charges and expenses against anticipated charges and expenses per contractual agreements, and confirming and recording earnings.",
                "scoreavg": 0
              }, {
                "id": "F2",
                "val": "Travel & Expense Approvals",
                "desc": "Travel & Expense Approvals define the approved processes, activities, and services associated with planning, preparing, and monitoring of business-related travels for the organization's employees.",
                "scoreavg": 0
              }, {
                "id": "F3",
                "val": "Payment Processing Execution",
                "desc": "Payment Processing Execution refer to a system of computer processes that process, verify, and accept or decline credit card transactions on behalf of the merchant through secure Internet connections.",
                "scoreavg": 0
              }, {
                "id": "F4",
                "val": "Advance Payments Approvals",
                "desc": "Advance Payment Approvals gives the permission for full or partial payment for goods and services before they are received in good order or rendered satisfactorily.",
                "scoreavg": 0
              }, {
                "id": "F5",
                "val": "Payment Exception Management",
                "desc": "Payment Exception Management manages the exceptions to standard payment processes.",
                "scoreavg": 0
              }, {
                "id": "F6",
                "val": "Payment Authorization",
                "desc": "Payment Authorization refers to the approval of an individual payment by authorized personnel.",
                "scoreavg": 0
              }, {
                "id": "F7",
                "val": "Tax Management",
                "desc": "Tax Management tracks compliance with sales, and use taxes and returns, property tax returns, payroll taxes and other filings in accordance with local, regional, and national guidelines.",
                "scoreavg": 0
              }, {
                "id": "F8",
                "val": "Discount Management",
                "desc": "Discount Management refers to taking advantage of timing of payment options to qualify for favorable discounts on invoice payments.",
                "scoreavg": 50
              }, {
                "id": "F9",
                "val": "Duplicate Payment Detection & Prevention",
                "desc": "Duplicate Payment Detection & Prevention provides continuous, proactive monitoring to detect duplicate payments, overpayments and AP invoice outliers across multiple systems and data formats.",
                "scoreavg": 0
              }]
            }];
            var newDataArr = success.items.concat(itemsArr);
            */
            self.myObservableArray(prepareDataSourceArray(success.items));
            self.dataSource(prepareDataSource(self.myObservableArray()));
            //console.log(self.dataSource());
            self.dataGridPrgrsVisible(false);
            self.dataGridProgress(true);
          },
          function (failure) {
            console.log("[dataGrid]:Failure while fetching Grid Data");
            console.log(failure);
          }
        );
      };

      self.prepareGridData();
      //--------dhrajago addition for datagrid REST service integration ends-----------

      //---------Datagrid header/cell renderer functions begins--------------
      this.columnHeaderStyle = function(headerContext) 
      {
          /* if (column == 5)
          {
              return 'width:190px;height:50px; background:linear-gradient(to bottom,#0041BF,95%, #052EA1);font-size:12px;font-weight:bold;color:white;text-align:center;';
              return 'width:150px;height:50px; background:linear-gradient(#0043CE, #002D9C);font-size:11px;font-weight:bold;color:white;text-align:center;';
              return 'width:150px;height:50px; background:linear-gradient(#535a5a, #2b2b2b);font-size:11px;font-weight:bold;color:white;text-align:center;';
              return 'width:150px;height:50px; background:#4D5358;font-size:11px;font-weight:bold;color:white;text-align:center;';
          } */
          //return 'width:150px;height:50px;background:#697077;font-size:11px;font-weight:bold;color:white;text-align:center;';
          var columnLength = headerContext['datasource']['columns'].length;
          var width = 100; 


          var threeColWidth = 300;
          var fourColWidth = 225;
          var fiveColWidth = 180;
          var sixColWidth = 165;
          var sevenColWidth = 142;
          var eightColWidth = 120;
          var nineColWidth = 110;

          var screenWidth = screen.width;

           //alert("[dataGrid]: Screen resolution is: " + screen.width + "x" + screen.height);
          if (screenWidth == 1280)
          {
            sixColWidth   = 166;   //x = 7.710
            sevenColWidth = 142.5; //x = 8.9
            //eightColWidth = 120;
            nineColWidth  = 110.5; //x = 11.58
          }
          else if (screenWidth == 1440)
          {
            sixColWidth   = 188; //x=7.6
            sevenColWidth = 161; //x=8.944
            //eightColWidth = 120;
            nineColWidth  = 125; //x=11.52
          }
          else if (screenWidth == 1600)
          {
            sixColWidth   = 210; //x=7.62
            sevenColWidth = 180; //x=8.89
            //eightColWidth = 120;
            nineColWidth  = 140; //x=11.43
          }
          else{
            sixColWidth   = screenWidth / 7.615;
            sevenColWidth = screenWidth / 8.911;
            nineColWidth  = screenWidth / 11.51;
          }
          

          
          //Control the width of the grid header column here (overall grid width resize happens)
          if(columnLength==3) width = threeColWidth;
          if(columnLength==4) width = fourColWidth;
          if(columnLength==5) width = fiveColWidth;
          if(columnLength==6) width = sixColWidth;
          if(columnLength==7) width = sevenColWidth;
          if(columnLength==8) width = eightColWidth;
          if(columnLength==9) width = nineColWidth;


          var height = 70;
          var threeToEightColHt = 50;
          var nineColHt = 60;
          /* if (screen.height == 720)
          {
            threeToEightColHt = 50;
            nineColHt = 60;
          }*/

          //Control the height of the grid header column here
          if(columnLength>=3 && columnLength<=8) height = threeToEightColHt;
          if(columnLength==9) height = nineColHt;

          return 'width:'+width+'px;height:'+height+'px;background:#697077;font-size:11px;font-weight:bold;color:white;text-align:center;';
      };

      this.columnHeaderRenderer = function(headerContext)
      {
        var columnName = self.colsArr[headerContext['index']];
        var container = document.createElement('div');
        container.className = 'headercell-div-container';
        var headerCellId = headerContext['parentElement'].id;
        var headerId = self.competencyIdArr[headerContext['index']];
        //container.addEventListener("click", myFunction);
        headerContext['parentElement'].addEventListener("click", function(){
          openCompetencyDetail(columnName, headerCellId, headerId);
        }, false);
        container.appendChild(document.createTextNode(columnName));
        return {'insert':container};
      }

      function openCompetencyDetail(columnName, headerCellId, headerId) {
        //self.prepareLeadingPracticesData();
        self.competencyName(columnName);
        self.selectedCompetencyCellId(headerCellId);
        self.selectedCompetencyId(headerId);
        //Create Competency Details Module
        self.competencyModuleCreate();
        //self.competencyRegionDialogTitle(self.competencyRegionDialogTitle()+": "+columnName);
        document.getElementById('competencyDrilldownDialog').open();
      }
      
      this.rowHeaderStyle = function(headerContext) 
      {
          //return 'width:150px;height:50px;background-color:#b3b3b3;font-size:12px;font-weight:bold;text-align:center;';
          var columnLength = headerContext['datasource']['columns'].length;
          var height = 60;
          if(columnLength>=3 && columnLength<=8) height = 50;
          return 'height:'+height+'px;';
      };

      this.rowHeaderRenderer = function(headerContext) {
        //console.log(headerContext);
        var value = headerContext['data'];
        if(headerContext['index']==1 || headerContext['index']==2 || headerContext['index']==3 || headerContext['index']==5 || headerContext['index']==6 || headerContext['index']==7 || headerContext['index']==8 || headerContext['index']==9 || headerContext['index']==11 || headerContext['index']==12 || headerContext['index']==13 || headerContext['index']==14 || headerContext['index']==15) {
          value = "";
        }
        var container = document.createElement('div');
        container.className = 'demo-content-container';
        container.appendChild(document.createTextNode(value));

        return {'insert':container}
     };
  
      this.cellClassName = function(cellContext) 
      {
          var data = cellContext['data'];
          //console.log(self.scoreavgArr[data]);
          //console.log(document.getElementById('btnSwitch').value);
          var classSelected = document.getElementById('btnSwitch').value;
          //Common Classes
          var commmonClassList = "oj-sm-justify-content-center oj-sm-align-items-center oj-helper-justify-content-center";
          //Classic (or) Standard Grid CSS
          var classicDataGridClass = "classic-datagrid ";
          //Core (or) Heat Map Grid CSS
          var coreDataGridClass = "core-datagrid ";
          //Core (or) Heat Map Grid - Low CSS
          var coreDataGridLowClass = "core-datagrid-low ";
          //Core (or) Heat Map Grid - Med CSS
          var coreDataGridMedClass = "core-datagrid-med ";
          //Core (or) Heat Map Grid - High CSS
          var coreDataGridHighClass = "core-datagrid-high ";          

          if (classSelected=="core")
          {
            if(self.scoreavgArr[data]==1)
            {
              return coreDataGridLowClass+ coreDataGridClass + commmonClassList;
            }
            else if(self.scoreavgArr[data]==2)
            {
              return coreDataGridMedClass + coreDataGridClass + commmonClassList;
            }
            else if(self.scoreavgArr[data]==3)
            {
              return coreDataGridHighClass + coreDataGridClass + commmonClassList;
            }
            else
            {
              return coreDataGridClass + commmonClassList;
            }
          }
          if (classSelected=="classic")
          {
            return classicDataGridClass + commmonClassList;
          }
      }
      this.cellColorHighlight = function(cellContext) 
      {
          //console.log(cellContext);
          //return 'width:150px;height:50px;font-size:10px;font-weight:bold;text-align:center;';
          if(cellContext['indexes']['column']==0)
            return 'font-size:10px;font-weight:bold;text-align:center;border-left-width:0.99px;';
          else
            return 'font-size:10px;font-weight:bold;text-align:center;';
      }   
      
      this.cellRenderer = function(cellContext)
      {
        var container = document.createElement('div');
        container.className = 'cell-div-container';
        var data = cellContext['data'];
        var sourceCellId = cellContext['parentElement'].id;
        container.addEventListener("click", function(){
          handleComponentCellClick(data,sourceCellId);
        }, false);
        container.appendChild(document.createTextNode(data));
        return {'insert':container};
      }

      function handleComponentCellClick(data,sourceCellId) {
        //console.log(sourceCellId);
        self.selectedBizCompCellId(sourceCellId);
        self.selectedBizCompName(data);
        self.selectedBizCompDesc(self.descArr[data]);
        self.selectedBizCompId(self.cmptIdArr[data]);
        //console.log("[dataGrid]:Selected BizCompId = "+self.selectedBizCompId());

        //Instantiate Module Creation on Cell Click
        self.bizCompKpiModuleCreate();
        self.bizCompCntrlModuleCreate();
        self.bizCompAssetModuleCreate();

        document.getElementById('bizCompDialog').open();
      }
      //---------Datagrid header/cell renderer functions ends--------------
      //dakshayani changes end

      /**Grid Side Panel Data Module- Start*/
      self.gridSidePanelConfig = ko.observable({'view':'','viewModel':''});
      self.gridSidePanelModuleCreate = function(){
        var gridSidePanelModLoad = Promise.all([
          moduleUtils.createView({'viewPath':'views/gridSidePanel.html'}),
          moduleUtils.createViewModel({'viewModelPath':'viewModels/gridSidePanel','initialize':'always'})
        ]);
        gridSidePanelModLoad.then(
          function(values){
            self.gridSidePanelConfig({'view':values[0],'viewModel':values[1]});
          }
        );
      };
      /**Grid Side Panel Data Module - End*/

      /**Business Component Benchmarks Module - Start*/
      self.cmpntBenchmarksConfig = ko.observable({'view':'','viewModel':''});
      self.bizCompKpiModuleCreate = function(){ 
        var cmpntBenchmarksModLoad = Promise.all([
          moduleUtils.createView({'viewPath':'views/componentBenchmarks.html'}),
          moduleUtils.createViewModel({'viewModelPath':'viewModels/componentBenchmarks','initialize':'always','params':{selectedBizCompId: self.selectedBizCompId()}})
        ]);
        cmpntBenchmarksModLoad.then(
          function(values){
            self.cmpntBenchmarksConfig({'view':values[0],'viewModel':values[1]});
          }
        );
      };      
      /**Business Component Benchmarks Module - End*/

      /**Business Component Controls Module - Start*/
      self.cmpntControlsConfig = ko.observable({'view':'','viewModel':''});
      self.bizCompCntrlModuleCreate = function(){ 
        var cmpntControlsModLoad = Promise.all([
          moduleUtils.createView({'viewPath':'views/componentControls.html'}),
          moduleUtils.createViewModel({'viewModelPath':'viewModels/componentControls','initialize':'always','params':{selectedBizCompId: self.selectedBizCompId()}})
        ]);
        cmpntControlsModLoad.then(
          function(values){
            self.cmpntControlsConfig({'view':values[0],'viewModel':values[1]});
          }
        );
      };      
      /**Business Component Controls Module - End*/

      /**Business Component Assets Module - Start*/
      self.cmpntAssetsConfig = ko.observable({'view':'','viewModel':''});
      self.bizCompAssetModuleCreate = function(){ 
        var cmpntAssetsModLoad = Promise.all([
          moduleUtils.createView({'viewPath':'views/componentAssets.html'}),
          moduleUtils.createViewModel({'viewModelPath':'viewModels/componentAssets','initialize':'always','params':{selectedBizCompId: self.selectedBizCompId()}})
        ]);
        cmpntAssetsModLoad.then(
          function(values){
            self.cmpntAssetsConfig({'view':values[0],'viewModel':values[1]});
          }
        );
      };      
      /**Business Component Assets Module - End*/

      self.backToSearch = function() {
        app.loadSearchPortalModule();
      };

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */      
      self.connected = function () {
        // Implement if needed
        console.log("[dataGrid]: Inside Connected");
        self.gridSidePanelModuleCreate();
        self.leadingPracticesModuleCreate();
        self.orgHeirarchyModuleCreate();

      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function () {
        // Implement if needed
        console.log("[dataGrid]: Inside Disconnected");
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
    return DataGridViewModel;
  }
);