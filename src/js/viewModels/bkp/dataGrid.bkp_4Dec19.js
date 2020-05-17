/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your customer ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojmodel', 'ojs/ojmodule-element-utils','ojs/ojvalidation-base', 'ojs/ojknockouttemplateutils', 'ojs/ojcollectiondatagriddatasource', 'ojs/ojarraydataprovider','ojs/ojarraytreedataprovider','ojs/ojcollectiondataprovider', 'ojs/ojarraydatagriddatasource', 'restModule',  'ojs/ojknockout', 'ojs/ojdatagrid', 'ojs/ojvalidation-number', 'ojs/ojbutton', 'ojs/ojdialog', 'ojs/ojpopup', 'ojs/ojlistview', 'ojs/ojnavigationlist', 'ojs/ojswitcher',
 'ojs/ojcollapsible', 'ojs/ojoffcanvas', 'ojs/ojtable','ojs/ojlabel','ojs/ojgauge','ojs/ojradioset'
  ],
  function (oj, ko, $, app, Model, moduleUtils , ValidationBase, KnockoutTemplateUtils, collectionModule, ArrayDataProvider,ArrayTreeDataProvider, CollectionDataProvider,arrayModule,restModule) {

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
      
      self.thresholdValues = [{max: 33}, {max: 67}, {}];
      this.customSvgStyle = {fill: 'url(' + document.URL + '#pattern)'};

      self.selectedItem = ko.observable("info");
      self.currentEdge = ko.observable("top");
      
      self.leadingPracticeDialogTitle = ko.observable("Leading Practices");

      //self.showProcess = ko.observable(true);
      //dhrajago addition ends

      self.dataGridPrgrsVisible = ko.observable(true);
      self.dataGridProgress = ko.observable(false);
      self.myObservableArray = ko.observableArray([]);
      self.dataSource = ko.observable();
      self.competencyRegionDialogTitle = ko.observable("Competency Details");
      self.selectedBizCompCellId = ko.observable("");
      self.gridPageHeader = ko.observable("Procurement Management");


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

       /**Leading Practices - Start*/
      self.leadingPrctseConfig = ko.observable({'view':'','viewModel':''});     
      var leadingPrctiseModLoad = Promise.all([
        moduleUtils.createView({'viewPath':'views/leadingPractices.html'}),
        moduleUtils.createViewModel({'viewModelPath':'viewModels/leadingPractices','initialize':'always'})
      ]);
      leadingPrctiseModLoad.then(
        function(values){
          self.leadingPrctseConfig({'view':values[0],'viewModel':values[1]});
        }
      );      
      /**Leading Practices - End*/

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
      }.bind(this);

      

      //dhrajago addition begins
      this.KnockoutTemplateUtils = KnockoutTemplateUtils;
      
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
                
        for(var i=0; i<responseItems.length; i++){
          var dt = responseItems[i];
          var cdata = dt.cmptnt;
          self.colsArr.push(dt.cmptname);
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
        //console.log("dataGrid::Printing Object ===> ");    
        //console.log(obj);
        return ko.observableArray(obj);
      }
      
      function prepareDataSource(rawcells) {
        //console.log("load datagrid...",rawcells())
        //return new arrayModule.ArrayDataGridDataSource(rawcells, null);
        return new arrayModule.ArrayDataGridDataSource(rawcells);
      }
      
      //--------dhrajago addition for datagrid REST service integration begins---------
      this.gridRgnDataProvider = ko.observableArray([]);
      this.cbmGridCollection = null;
      self.cbmGridServiceURL = ko.observable("http://129.150.172.40:8080/ords/portal_workspace/xxibm_portal_grid/fetchGridDataByDomain/");

      console.log("dataGrid:: Data Grid Service URI: " + self.cbmGridServiceURL());

      self.setGridCustomHdr = function (operation, collection, options) {
        var retObj = {};
        if (operation === 'read') {

          console.log("dataGrid:: Set Custom Header for Grid Service. Domain Code = "+app.selectedDomainCode())
          retObj['headers'] = {
           'DOM_CODE_VAR': app.selectedDomainCode() //"DOM001"
          };
          retObj['mimeType'] = "text/plain";
        }
        return retObj;
      };
      
      self.prepareGridData = function () {
        self.dataGridPrgrsVisible(true);

        var cbmGridModel = Model.Model.extend({
          idAttribute: 'cmptid'
        });

        var cbmGridCollection = new Model.Collection(null, {
          url: self.cbmGridServiceURL(),
          customURL: self.setGridCustomHdr,
          model: cbmGridModel,
          comparator: "cmptid",
        });

        self.cbmGridCollection = cbmGridCollection;
        //self.gridPrgrsVisible(false);

        console.log("dataGrid:: Grid REST :: Next to call fetch collection");
        //Call FetchMethod to load the dropdown
        self.cbmGridCollection.fetch().then(
          function (success) {
            console.log("DataGrid::Successful Fetch ==>");
            console.log(success.items);
            
            self.myObservableArray(prepareDataSourceArray(success.items));
            self.dataSource(prepareDataSource(self.myObservableArray()));
            //console.log(self.dataSource());
            self.dataGridPrgrsVisible(false);
            self.dataGridProgress(true);

            /* self.gridRgnDataProvider(new ArrayDataProvider(success.items, {
              keyAttributes: 'cmptid'
            }));
            console.log(self.gridRgnDataProvider());
            */
          },
          function (failure) {
            console.log("Failure while fetching Grid Data");
            console.log(failure);
          }
        );
      };
      self.prepareGridData();
      
      // -------------------------------------------
      // Note:
      // -------------------------------------------
      // Array is returned in success.items 
      // we can use observable array to work with it
      // -------------------------------------------
      
      //--------dhrajago addition for datagrid REST service integration ends-----------

      this.columnHeaderStyle = function(headerContext) 
      {
          var column = headerContext['key'];
          /* if (column == 5)
          {
              return 'width:190px;height:50px; background:linear-gradient(to bottom,#0041BF,95%, #052EA1);font-size:12px;font-weight:bold;color:white;text-align:center;';
              return 'width:150px;height:50px; background:linear-gradient(#0043CE, #002D9C);font-size:11px;font-weight:bold;color:white;text-align:center;';
              return 'width:150px;height:50px; background:linear-gradient(#535a5a, #2b2b2b);font-size:11px;font-weight:bold;color:white;text-align:center;';
              return 'width:150px;height:50px; background:#4D5358;font-size:11px;font-weight:bold;color:white;text-align:center;';
          } */
          /*4D5358 */ 
          return 'width:150px;height:50px; background:#4D5358;font-size:11px;font-weight:bold;color:white;text-align:center;';
      };

      this.columnHeaderRenderer = function(headerContext)
      {
        var columnName = self.colsArr[headerContext['index']];
        var container = document.createElement('span');
        container.addEventListener("click", handleCompetencyHeaderClick);
        container.appendChild(document.createTextNode(columnName));
        return {'insert':container}
      }
      function handleCompetencyHeaderClick() {
        document.getElementById('competencyDrilldownDialog').open();
      }
      
      this.rowHeaderStyle = function(headerContext) 
      {
          var row = headerContext['key'];
          return 'width:150px;height:50px;background-color:#b3b3b3;font-size:12px;font-weight:bold;text-align:center;';
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
          if (classSelected=="core")
          {
            if(self.scoreavgArr[data]==1)
            {
              return 'core-datagrid-low core-datagrid oj-sm-justify-content-center oj-sm-align-items-center oj-helper-justify-content-center';
            }
            else if(self.scoreavgArr[data]==2)
            {
              return 'core-datagrid-med core-datagrid oj-sm-justify-content-center oj-sm-align-items-center oj-helper-justify-content-center';
            }
            else if(self.scoreavgArr[data]==3)
            {
              return 'core-datagrid-high core-datagrid oj-sm-justify-content-center oj-sm-align-items-center oj-helper-justify-content-center';
            }
            else
            {
              return 'core-datagrid oj-sm-justify-content-center oj-sm-align-items-center oj-helper-justify-content-center';
            }
          }
          if (classSelected=="classic")
          {
            return 'classic-datagrid oj-sm-justify-content-center oj-sm-align-items-center oj-helper-justify-content-center';
          }
      }
      this.cellColorHighlight = function(cellContext) 
      {
          var column = cellContext['keys']['column'];
          //console.log(cellContext);
          //var context = document.getElementById("datagrid").getContextByNode("oj-datagrid-cell");
          //console.log(cellContext);
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
          /* var num = 500/6;
          var ht = num.toFixed(0);              
          if (cellContext['indexes']['row'] === 0  && cellContext['indexes']['column']=== 1)
          {
              //console.log(ht);
              return 'max-height:'+ht+'px;font-size:10px;text-align:center;font-weight:bold;color:#054ADA;';
          }
          else if(cellContext['data']=="")
          {
            return 'display:none;'
          } 
          else {*/
            //return 'background-color:#e6ecff;height:40px;font-size:10px;text-align:center;font-weight:bold;';
            return 'width:150px;height:50px;font-size:10px;font-weight:bold;text-align:center;';
          //}
      }   
      this.popOutSelection = function(cellContext)
      {
        //console.log(cellContext.target);
        if(cellContext.detail.value!=undefined)
        {
          var d = cellContext.detail.value.indexes;
          if (cellContext.detail.value.type=='cell' && d.row === 0  && d.column=== 3)
          {
            return 'background-color:blue;'
          }
        }
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
        console.log(sourceCellId);
        self.selectedBizCompCellId(sourceCellId);
        self.selectedBizCompName(data);
        self.selectedBizCompDesc(self.descArr[data]);
        self.selectedBizCompId(self.cmptIdArr[data]);
        //console.log("***************Selected BizCompId = "+self.selectedBizCompId());

        //Trial for Module Creation
        self.bizCompKpiModuleCreate();


        //Prepare sub-tabs in Biz Comp Popup
        //self.prepareKpiData();
        self.prepareCntrlData();
        self.prepareAssetData();

        

        document.getElementById('bizCompDialog').open();
      }

      /*this.handleOKClose =  document.querySelector('datagrid').addEventListener('ojClose', function (event) {
        console.log(event);
      }.bind(this));*/

       /*$( "#competencyDrilldownDialog" ).ojDialog({
        "close": function( event, ui ) {
          console.log("Sairam ==> Inside competencyDrilldownDialog close");
          console.log(event);
        }
      });

      $( "#bizCompDialog" ).on( "ojclose", function( event, ui )
      {
        console.log(event);
        // verify that the component firing the event is a component of interest
        //if ($(event.target).is(".mySelector")) {}
      } ); */
      
      /*  document.getElementById('datagrid').addEventListener('selectionChanged', function (event) {
        //on selection change update fields with the selected model
        var selection = event.detail['value'][0];
        if (selection != null) {
          var rowKey = selection['startKey']['row'];
          this.modelToUpdate = this.collection.get(rowKey);
          this.updateFields(this.modelToUpdate);
        }
      }.bind(this)); */

      //dakshayani changes end
      //dhrajago addition ends

      //dhrajago addition for popup begins
      this.closeBizCompDialog = function (event) {
        document.getElementById('bizCompDialog').close();
      }

      //this.selectedBizCompName = ko.observable("");
      //this.selectedBizCompDesc = ko.observable("");
      //this.selectedBizCompId = ko.observable("");
      this.openBizCompDialog = function (event, $context) {
        self.selectedBizCompName($context.data);
        self.selectedBizCompDesc(self.descArr[$context.data]);
        self.selectedBizCompId(self.cmptIdArr[$context.data]);
        //Prepare sub-tabs in Biz Comp Popup
        self.prepareKpiData();
        self.prepareCntrlData();
        self.prepareAssetData();
        
        document.getElementById('bizCompDialog').open();
      }
      //dhrajago addition for popup ends


       /**Grid Side Panel Data - Start*/
       self.gridSidePanelConfig = ko.observable({'view':'','viewModel':''});     
       var gridSidePanelModLoad = Promise.all([
         moduleUtils.createView({'viewPath':'views/gridSidePanel.html'}),
         moduleUtils.createViewModel({'viewModelPath':'viewModels/gridSidePanel','initialize':'always'})
       ]);
       gridSidePanelModLoad.then(
         function(values){
           self.gridSidePanelConfig({'view':values[0],'viewModel':values[1]});
         }
       );      
       /**Grid Side Panel Data - End*/

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

       



      //Popup (BizComp) Level tab addition code begins
      this.selectedCompItem = ko.observable("benchmark");
      this.compTabEdge = ko.observable("top");
      //Popup (BizComp) Level tab addition code ends

      //Popup (BizComp) set Header region attributes begins
      self.selectedBizCompName = ko.observable("");
      self.selectedBizCompDesc = ko.observable("");
      self.selectedBizCompId = ko.observable("");
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
      };
      //------code addition for Component Menu Drilldown ends---------------

      /* 
      //------code addition for KPI Benchmark Drilldown Listview begins---------------
      var kpiRestUri = "http://129.150.172.40:8080/ords/portal_workspace/xxibm_portal_mstr_data_view/xxibm_portal_mstr_ibv_kpi_view_get/";
      var corsBypassUri = "https://cors-anywhere.herokuapp.com/";
      self.queryURL = ko.observable(kpiRestUri);
      self.kpiResponse = ko.observableArray([]);
      self.kpiAjaxDataProvider = ko.observable();
      

      // Generate authorization headers to inject into rest calls
      self.getHeaders = function () {
        var currConvRate = getCurrentUserCurrencyRate();
        if (currConvRate === null)
        {
          currConvRate = "1.0";
        }

        var currencyCode = getCurrentUserCurrency();
        if (currencyCode === null)
        {
          currencyCode = "USD";
        }

        console.log("dataGrid::KPI REST Service call:: Conversion Rate =>" + currConvRate);
        return {
          'headers': {
            //'Authorization': 'Bearer ' + self.token(),
            INDUSTRY_VAR: app.selectedIndustryCode() //'IND002'
           ,DOMAIN_CODE_VAR: app.selectedDomainCode() //'DOM001'
           ,RECORD_ID_VAR: self.selectedBizCompId()  //'E10'//'B1'
           ,CONV_RATE_VAR: String(currConvRate) //'71.236'
           ,CURRENCY_VAR: String(currencyCode) //'USD'
          }
        };
      };

      self.prepareKpiData = function () {

        //AJAX Call
        //app.showGlobalProgress();
        self.kpiPrgrsVisible(true);
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
      };
      //----code for REST service callout ends-------------
 */

      //------code addition for Controls Drilldown Listview begins---------------
      this.cntrlRgnDataProvider = ko.observable();
      this.cntrlCollection = null;
      self.cntrlServiceURL = ko.observable("../../json/control.json");
      self.cntrlServiceURL("http://129.150.172.40:8080/ords/portal_workspace/xxibm_portal_controls_risks/xxibm_portal_controls_risks_get/");

      console.log("dataGrid::Control Service URI: " + self.cntrlServiceURL());

      self.setCntrlCustomHdr = function (operation, collection, options) {
        var retObj = {};
        if (operation === 'read') {
          //retObj['headers'] = {'prUrl': self.prUrl, 'pr-authoriztion': self.prAuthEncoded};
          retObj['headers'] = {
            'RECORD_ID_VAR': self.selectedBizCompId()   //"E7"
           ,'DOMAIN_CODE_VAR': app.selectedDomainCode() //"DOM001"
          };
          retObj['mimeType'] = "text/plain";
        }
        return retObj;
      };
      
      self.prepareCntrlData = function () {
        self.cntrlPrgrsVisible(true);

        var cntrlModel = Model.Model.extend({
          idAttribute: 'cid'
        });

        var cntrlCollection = new Model.Collection(null, {
          url: self.cntrlServiceURL(),
          customURL: self.setCntrlCustomHdr,
          model: cntrlModel,
          comparator: "cid",
          parse: function (success) {
            self.cntrlPrgrsVisible(false);
          }
        });

        this.cntrlCollection = cntrlCollection;
        this.cntrlRgnDataProvider(new CollectionDataProvider(cntrlCollection));
        //self.cntrlPrgrsVisible(false);
      };
      //------code addition for Controls Drilldown Listview ends---------------



      //------code addition for Cognitive RPA Asset Drilldown Listview begins---------------
      this.cogRpaAssetDataProvider = ko.observable();
      this.cogRpaAssetCollection = null;
      self.cogRpaAssetSrvcURL = ko.observable("../../json/asset.json");
      self.cogRpaAssetSrvcURL("http://129.150.172.40:8080/ords/portal_workspace/xxibm_portal_rpa_assets/xxibm_portal_rpa_assets_get/");
      console.log("dataGrid::Cognitive RPA Asset Service URI: " + self.cogRpaAssetSrvcURL());
      
      self.prepareAssetData = function () {
        self.assetPrgrsVisible(true);
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
      };
      //------code addition for Cognitive RPA Asset Drilldown Listview ends---------------


      //----- code addition for Competency Benchmarks begins--------------
      self.cmptncyKpiCollSync = function (method, model, options) {
        console.log("[dataGrid]::cmptncyKpiCollSync begins");

        console.log(method);
        console.log(options);
        console.log(model);
        console.log(restModule.API_URL.viewCompetencyKpis);

        var cmptncyKpiService = {url: restModule.API_URL.viewCompetencyKpis, method: "GET", data: {}};
        /*URL Parameters*/
        cmptncyKpiService.parameters = {};
        /*Header Parameters*/
        cmptncyKpiService.headers = {COMPETENCY_CODE_VAR: "E", DOMAIN_CODE_VAR:app.selectedDomainCode() };
        restModule.callRestAPI(cmptncyKpiService, function (response) {
            console.log("[dataGrid]:: Inside Competency KPI Success Response");
            console.log(response);
            if (response.items && response.items != null) {
              console.log("[dataGrid]:: Inside IF");
              console.log(response.items);
              //Integrate with Array Provider
              //self.CopmpteDP(new ArrayDataProvider(response.items));
            } else {
              console.log("[dataGrid]:: Inside ELSE");
            }
            }, function (failResponse) {
                var lpServiceFailPrompt = "Competency KPI Service failure";
                console.log(lpServiceFailPrompt);
                console.log(failResponse);
                //options["error"](failResponse, null, options);
                app.showMessages(null, 'error', lpServiceFailPrompt);
            });
        };
        self.cmptncyKpiCollSync();
      //-----code addition for Competency Benchmarks ends-----------------

    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new DataGridViewModel();
  }
);