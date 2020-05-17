/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your customer ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojmodel', 'ojs/ojmodule-element-utils', 'ojs/ojvalidation-base', 'ojs/ojknockouttemplateutils', 'ojs/ojcollectiondatagriddatasource', 'ojs/ojarraydataprovider', 'ojs/ojarraytreedataprovider', 'ojs/ojcollectiondataprovider', 'ojs/ojarraydatagriddatasource', 'restModule','ojs/ojresponsiveknockoututils', 'ojs/ojresponsiveutils','ojs/ojknockout', 'ojs/ojdatagrid', 'ojs/ojvalidation-number', 'ojs/ojbutton', 'ojs/ojdialog', 'ojs/ojpopup', 'ojs/ojlistview', 'ojs/ojnavigationlist', 'ojs/ojswitcher',
        'ojs/ojcollapsible', 'ojs/ojoffcanvas', 'ojs/ojtable', 'ojs/ojlabel', 'ojs/ojgauge', 'ojs/ojradioset', 'ojs/ojlegend','ojs/ojpopup'
    ],
    function(oj, ko, $, app, Model, moduleUtils, ValidationBase, KnockoutTemplateUtils, collectionModule, ArrayDataProvider, ArrayTreeDataProvider, CollectionDataProvider, arrayModule, restModule,responsiveKnockoutUtils,responsiveUtils) {

        function DataGridViewModel() {
            var self = this;
            // Below are a set of the ViewModel methods invoked by the oj-module component.
            // Please reference the oj-module jsDoc for additional information.

            //Instantiate Variables
            var smQuery = responsiveUtils.getFrameworkQuery(
                responsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
            self.isSmall = responsiveKnockoutUtils.createMediaQueryObservable(smQuery);
            app.hideGlobalProgress();
            self.waitProgress = ko.observable(-1);

            self.selectedItem = ko.observable("info");
            self.currentEdge = ko.observable("top");

            self.leadingPracticeDialogTitle = ko.observable("Leading Practices");

            self.dataGridPrgrsVisible = ko.observable(true);
            self.dataGridProgress = ko.observable(false);
            self.gridDataArray = ko.observableArray([]);
            self.cbmDataSource = ko.observable();
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

            //Variables for prepare grid datasource
            self.colsArr = [];
            self.descArr = [];
            self.scoreavgArr = [];
            self.competencyIdArr = [];
            self.cmptIdArr = [];
            self.extentArr = [];
            self.extentValArr = [];
            self.indSpecfcData= [];
            
            /**Responsive clasees */
            self.gridScale = ko.observable("oj-flex-item oj-sm-10 oj-md-10 oj-lg-10");
            self.gridSidePanelScale = ko.observable("oj-flex-item oj-sm-2 oj-md-2 oj-lg-2");
            self.selPainPointCompId = ko.observable([]);
            self.selPainPointSoltns = ko.observable([]);

            /**Legend Data */
            self.rapdMvLegnd = ko.observable([{ text: "60%+", class: "_60Savng" }, { text: "40%+", class: "_40Savng" }, { text: "20%+", class: "_20Savng" }]);

            self.setGridHeader = function() {
                if (typeof(app.selectedIndustryTxt()) == 'undefined') {
                    app.updateCntrlrObjsFrmSession();
                }
                self.gridPageHeader(app.selectedIndustryTxt() + ' > ' + app.selectedDomainTxt());
            };

            self.currentModuleParams = function() {
                self.dataGridProgress(false);
                self.cbmDataSource();
                self.gridDataArray([]);
                clearGridArrayCache();
            };

            /**Set Data Grid Header based on Context */
            //self.setGridHeader();            
            /**Leading Practices - Start*/
            self.leadingPrctseConfig = ko.observable({ 'view': '', 'viewModel': '' });
            self.leadingPracticesModuleCreate = function() {
                var leadingPrctiseModLoad = Promise.all([
                    moduleUtils.createView({ 'viewPath': 'views/leadingPractices.html' }),
                    moduleUtils.createViewModel({ 'viewModelPath': 'viewModels/leadingPractices', 'initialize': 'always' })
                    //moduleUtils.createViewModel({'viewModelPath':'viewModels/leadingPractices',cleanupMode:'onDisconnect'})
                ]);
                leadingPrctiseModLoad.then(
                    function(values) {
                        self.leadingPrctseConfig({ 'view': values[0], 'viewModel': values[1] });
                    }
                );
            };
            /**Leading Practices - End*/

            /**Org chart -- start */            
            self.orgHeirarchyConfig = ko.observable({ 'view': '', 'viewModel': '' });
            self.orgHeirarchyModuleCreate = function() {
                var orgHeirarModLoad = Promise.all([
                    moduleUtils.createView({ 'viewPath': 'views/orgHeirarchy.html' }),
                    moduleUtils.createViewModel({ 'viewModelPath': 'viewModels/orgHeirarchy', 'initialize': 'always' })
                ]);
                orgHeirarModLoad.then(
                    function(values) {
                        self.orgHeirarchyConfig({ 'view': values[0], 'viewModel': values[1] });
                    }
                );
            };
            /**Org chart -- end */

            /**Rapid move -- start */            
            self.rapidMoveConfig = ko.observable({ 'view': '', 'viewModel': '' });
            self.rapidMoveModuleCreate = function() {
                var rpdMovModLoad = Promise.all([
                    moduleUtils.createView({ 'viewPath': 'views/rapidMove.html' }),
                    moduleUtils.createViewModel({ 'viewModelPath': 'viewModels/rapidMove', 'initialize': 'always' })
                ]);
                rpdMovModLoad.then(
                    function(values) {
                        self.rapidMoveConfig({ 'view': values[0], 'viewModel': values[1] });                        
                    }
                );
            };
            /**Rapid move -- end */

            /**Competency Details - Start*/            
            self.competencyDetailsConfig = ko.observable({ 'view': '', 'viewModel': '' });
            self.competencyModuleCreate = function() {
                var competencyDetailsModLoad = Promise.all([
                    moduleUtils.createView({ 'viewPath': 'views/competencyDetails.html' }),
                    moduleUtils.createViewModel({ 'viewModelPath': 'viewModels/competencyDetails', 'initialize': 'always', 'params': { selectedCmptncyName: self.competencyName(), selectedCmptncyId: self.selectedCompetencyId() } })
                ]);
                competencyDetailsModLoad.then(
                    function(values) {
                        self.competencyDetailsConfig({ 'view': values[0], 'viewModel': values[1] });
                    }
                );
            };
            /**Competency Details - End*/

            // Core - Classic button changes begins
            self.currentBtn = ko.observable("classic");
            self.btnOptions = ko.observableArray([
                { id: "classic", value: "classic", btn: "Standard", cls: "sidebar_switch_button2" },
                { id: "core", value: "core", btn: "Asset", cls: "sidebar_switch_button1" },
                { id: "indSpec", value: "indSpec", btn: "Industry", cls: "sidebar_switch_button1" }
            ]);
            self.selectedCoreClassic = ko.observable("classic");

            self.valueChangeHandler = function(event) {
                self.selectedCoreClassic = event['detail'].value;
                //Refresh datagrid on core/classic button selection
                document.getElementById("datagrid").refresh();                
                //self.gridSidePanelModuleCreate();
                setGridSidePanel(true);
            };
            // Core - Classic button changes ends

            this.bizCompDialogCloseHandler = function(event, ui) {
                //console.log(event,ui);
                $("#" + self.selectedBizCompCellId()).toggleClass("oj-selected oj-focus oj-datagrid-selected-top oj-datagrid-selected-bottom");
                if (self.selectedCompetencyCellId() != "") {
                    $("#" + self.selectedCompetencyCellId()).toggleClass("oj-focus");
                }
                self.selectedBizCompCellId("");
            }.bind(this);

            this.competencyDialogCloseHandler = function(event, ui) {
                //console.log(event,ui);
                $("#" + self.selectedCompetencyCellId()).toggleClass("oj-focus");
                if (self.selectedBizCompCellId() != "") {
                    $("#" + self.selectedBizCompCellId()).toggleClass("oj-selected oj-focus oj-datagrid-selected-top oj-datagrid-selected-bottom");
                }
                self.selectedCompetencyCellId("");
            }.bind(this);


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

            arrayModule.ArrayCellSet.prototype.getExtent = function(indexes) {
                return { 'row': this._getExtentHelper(indexes, 'row'), 'column': this._getExtentHelper(indexes, 'column') };
            };

            // a helper method to get the extent of a particular axis
            arrayModule.ArrayCellSet.prototype._getExtentHelper = function(indexes, axis) {
                var index = indexes[axis];
                //Get position of current col and row in extentArr
                var pos = $.inArray(indexes['column'] + "," + indexes['row'], self.extentArr);

                if ((index === 0 || index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6) && axis == 'column') {
                    var extent = 1;
                }
                /* else if ((index === 0 || index === 1) && axis == 'row')
                {
                    var extent = 1;
                } */
                else if (axis == 'row' && pos > -1) {
                    //console.log(self.extentValArr[pos]);
                    var extent = self.extentValArr[pos];
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
                return { 'extent': extent, 'more': { 'before': before, 'after': after } };
            };

            arrayModule.ArrayCellSet.prototype._getStartIndex = function(indexes, axis) {
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

            arrayModule.ArrayDataGridDataSource.prototype._getRowHeaderFromOptions = function(options) {
                return undefined;
            };

            function getColorsVal(avg) {
                var val = 0;
                if (avg > 0 && avg <= 30) val = 1;
                else if (avg > 30 && avg <= 60) val = 2;
                else if (avg > 60 && avg <= 100) val = 3;
                return val;
            }

            function clearGridArrayCache() {
                self.colsArr = [];
                self.descArr = [];
                self.scoreavgArr = [];
                self.competencyIdArr = [];
                self.cmptIdArr = [];
                self.extentArr = [];
                self.extentValArr = [];
                self.indSpecfcData = [];
            };

            function prepareDataSourceArray(responseItems) {
                console.log("[dataGrid]: prepareDataSourceArray begins");
                clearGridArrayCache();

                //console.log(self.colsArr, self.descArr, self.scoreavgArr, self.competencyIdArr, self.cmptIdArr,self.extentArr, self.extentValArr);

                var newDataArr = [];
                var maxLength = 0;
                for (var i in responseItems) {
                    var cellsArr = responseItems[i].cmptnt;
                    //console.log(cellsArr);
                    maxLength = Math.max(maxLength, cellsArr.length);
                }
                //console.log(maxLength);

                /* Setting grid height dynamically */
                console.log(self.noOfCols);
                var h = 70;
                var gh = 0;
                if (screen.height >= 720 && screen.height <= 864) {
                    if (self.noOfCols >= 3 && self.noOfCols <= 8) h = 50;
                    if (self.noOfCols == 9) h = 60;
                    gh = (maxLength * h) + 90;
                } else if (screen.height == 900) {
                    if (self.noOfCols >= 3 && self.noOfCols <= 8) h = 60;
                    if (self.noOfCols == 9) h = 65;
                    gh = (maxLength * h) + 90;
                } else {
                    if (self.noOfCols >= 3 && self.noOfCols <= 8) h = 60;
                    if (self.noOfCols == 9) h = 65;
                    gh = (maxLength * h) + 90;
                }
                //console.log("Grid ht:"+gh);            
                self.gridHeight(gh + "px");


                for (var i = 0; i < responseItems.length; i++) {
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
                    var v = parseInt(maxLength / arrLen).toFixed(0);
                    var s = maxLength - (v * arrLen);
                    for (var j = 0; j < arrLen; j++) {
                        if (arrLen < maxLength) {
                            col_arr.push(cdata[j].val);
                            //if((j!=0 && j!=(arrLen-1) && cLen>0) || (cLen==arrLen)) 
                            //console.log(j,cLen);
                            //if(j!=(arrLen-1) && cLen>0 && cLen<arrLen)   //Commented for fixing Procurement CBM extents
                            if (cLen > 0 && cLen <= arrLen) {
                                /* if(j==1) n = j;
                                var cLen = (maxLength/arrLen).toFixed(0);
                                //var eobj = {};
                                for(var k=0; k<cLen-1; k++)
                                {
                                  if(j!=(arrLen-2))
                                  { */
                                col_arr.push("");
                                cLen--;
                                self.extentArr.push(i + "," + n);
                                self.extentValArr.push(2);
                                n = n + 2;
                                /* console.log("col="+i+",row="+n+",extent="+cLen);   
                    eobj[i+","+n] = cLen;
                    exArr.push(eobj);  
                    n = n + 2;
                  }
                } */
                            } else if (cLen > arrLen) {
                                for (var k = 0; k < v - 1; k++) {
                                    col_arr.push("");
                                }
                                if (j != (arrLen - 1)) {
                                    var extVal = parseInt(v);
                                } else {
                                    var extVal = parseInt(v) + s;
                                }
                                self.extentArr.push(i + "," + m);
                                self.extentValArr.push(extVal);
                                m = m + parseInt(v);
                            }
                        } else {
                            col_arr.push(cdata[j].val);
                        }
                        self.descArr[cdata[j].val] = cdata[j].desc;
                        self.scoreavgArr[cdata[j].val] = getColorsVal(cdata[j].scoreavg);
                        self.indSpecfcData[cdata[j].val] = {};
                        self.indSpecfcData[cdata[j].val].isIndSpecfc = cdata[j].flag;
                        self.indSpecfcData[cdata[j].val].isPainPntSelctd = isIndPainPointMatchCell(cdata[j].id);                        
                        self.cmptIdArr[cdata[j].val] = cdata[j].id;

                    } // end for loop    

                    if (cLen > arrLen) {
                        for (var k = 0; k < s; k++) {
                            col_arr.push("");
                        }
                    }

                    newDataArr[i] = col_arr;
                    //console.log(col_arr);
                }
                //console.log(newDataArr, self.colsArr, self.descArr, self.scoreavgArr, self.cmptIdArr);
                //console.log(self.extentArr, self.extentValArr);

                var obj = [];
                for (var k = 0; k < maxLength; k++) {
                    var ndata = [];
                    for (var i = 0; i < newDataArr.length; i++) {
                        if (newDataArr[i][k] == undefined)
                            ndata.push("");
                        else
                            ndata.push(newDataArr[i][k]);
                    }
                    obj[k] = ndata;
                    //obj[self.colsArr[k]] = Object.assign({}, ndata);
                }
                //console.log(obj);
                console.log("[dataGrid]: prepareDataSourceArray ends");
                //return ko.observableArray(obj);
                return obj;
            }

            function prepareDataSource(rawcells) {
                return new arrayModule.ArrayDataGridDataSource(rawcells);
            }

            function isIndPainPointMatchCell(componentId){                  
                if(self.selPainPointCompId().includes(componentId))
                {
                    console.log(true);
                    return true;
                }
                // if(componentId == self.selPainPointCompId()){
                //   return true;
                // }
                return false;
            }

            //--------dhrajago addition for datagrid REST service integration begins---------
            /*
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
              self.gridDataArray([]);
              self.cbmDataSource(new arrayModule.ArrayDataGridDataSource([]));

              //Call FetchMethod to load the dropdown
              self.cbmGridDataSource.fetch().then(
                function (success) {
                  //console.log("[dataGrid]::Successful Grid Data Fetch");
                  //console.log(success.items);            
                  self.gridDataArray([]);
                  self.gridDataArray(prepareDataSourceArray(success.items));
                  self.cbmDataSource(new arrayModule.ArrayDataGridDataSource([]));
                  self.cbmDataSource(prepareDataSource(self.gridDataArray()));
                  //console.log(self.dataSource());
                  self.dataGridPrgrsVisible(false);
                  self.dataGridProgress(true);
                },
                function (failure) {
                  console.log("[dataGrid]:Failure while fetching Grid Data");
                  console.log(failure);
                }
              );
            }; */
            self.gridData = ko.observable();

            self.loadDataGrid = function() {
                console.log("[dataGrid]::loadDataGrid begins");

                //console.log(restModule.API_URL.viewDataGrid);
                self.dataGridPrgrsVisible(true);
                var cbmGridService = { url: restModule.API_URL.viewDataGrid, method: "GET", data: {} };
                /*URL Parameters*/
                cbmGridService.parameters = {};
                /*Header Parameters*/
                cbmGridService.headers = { DOM_CODE_VAR: app.selectedDomainCode(), INDUSTRY_VAR: app.selectedIndustryCode() };
                restModule.callRestAPI(cbmGridService, function(response) {
                    console.log("[dataGrid]:: loadDataGrid - CBM Grid Data Service Invoked");
                    if (response.items && response.items != null) {                        
                        self.gridData(response.items);
                        constructGridCellData(response.items);
                    } else {
                        console.log("[dataGrid]:: loadDataGrid - No CBM response defined for Business Process");
                    }
                    self.dataGridPrgrsVisible(false);
                    self.dataGridProgress(true);
                }, function(failResponse) {
                    self.dataGridPrgrsVisible(false);
                    self.dataGridProgress(true);
                    var cmptncyRoleSrvcFailPrompt = "Data Grid Service Failure";
                    console.log(cmptncyRoleSrvcFailPrompt);
                    console.log(failResponse);
                    app.showMessages(null, 'error', cmptncyRoleSrvcFailPrompt);
                });
            };

            function constructGridCellData(data) {
                console.log("[dataGrid]: constructGridCellData begins ");
                //console.log(data);

                //Clear KO observable grid data
                self.gridDataArray([]);
                self.cbmDataSource(new arrayModule.ArrayDataGridDataSource([]));

                //Set the new data for grid
                self.gridDataArray(prepareDataSourceArray(data));
                self.cbmDataSource(prepareDataSource(self.gridDataArray()));
                console.log("[dataGrid]: constructGridCellData ends ");
            };

            //self.prepareGridData();
            //--------dhrajago addition for datagrid REST service integration ends-----------

            //---------Datagrid header/cell renderer functions begins--------------
            this.columnHeaderStyle = function(headerContext) {
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

                //console.log("[dataGrid]: Screen resolution is: " + screen.width + "x" + screen.height);
                if (screenWidth == 1280) {
                    fiveColWidth = 199;
                    sixColWidth = 166; //x = 7.710
                    sevenColWidth = 142.5; //x = 8.9
                    eightColWidth = 112;
                    nineColWidth = 110.5; //x = 11.58
                } else if (screenWidth == 1440) {
                    fiveColWidth = 226;
                    sixColWidth = 188; //x=7.6
                    sevenColWidth = 161; //x=8.944
                    eightColWidth = 140;
                    nineColWidth = 125; //x=11.52
                } else if (screenWidth == 1600) {
                    //console.log("[dataGrid]: Resolution Inside ELSEIF for 1600");

                    fiveColWidth = 252;
                    sixColWidth = 210; //x=7.62
                    sevenColWidth = 180; //x=8.89
                    eightColWidth = 155;
                    nineColWidth = 140; //x=11.43
                } else {

                    //console.log("[dataGrid]: Resolution Inside ELSE");

                    fiveColWidth = screenWidth / 6.38435;
                    sixColWidth = screenWidth / 7.615;
                    sevenColWidth = screenWidth / 8.911;
                    eightColWidth = screenWidth / 10.5;
                    nineColWidth = screenWidth / 11.51;
                }



                //Control the width of the grid header column here (overall grid width resize happens)
                if (columnLength == 3) width = threeColWidth;
                if (columnLength == 4) width = fourColWidth;
                if (columnLength == 5) width = fiveColWidth;
                if (columnLength == 6) width = sixColWidth;
                if (columnLength == 7) width = sevenColWidth;
                if (columnLength == 8) width = eightColWidth;
                if (columnLength == 9) width = nineColWidth;


                var height = 70;
                var threeToEightColHt = 50;
                var nineColHt = 60;

                //Control the height of the grid header column here
                if (columnLength >= 3 && columnLength <= 8) height = threeToEightColHt;
                if (columnLength == 9) height = nineColHt;

                return 'width:' + width + 'px;height:' + height + 'px;background:#697077;font-size:11px;font-weight:bold;color:white;text-align:center;';
            };

            this.columnHeaderRenderer = function(headerContext) {
                var columnName = self.colsArr[headerContext['index']];
                var container = document.createElement('div');
                container.className = 'headercell-div-container';
                var headerCellId = headerContext['parentElement'].id;
                var headerId = self.competencyIdArr[headerContext['index']];
                //container.addEventListener("click", myFunction);
                headerContext['parentElement'].addEventListener("click", function() {
                    openCompetencyDetail(columnName, headerCellId, headerId);
                }, false);
                container.appendChild(document.createTextNode(columnName));
                return { 'insert': container };
            };

            function openCompetencyDetail(columnName, headerCellId, headerId) {
                //self.prepareLeadingPracticesData();
                self.competencyName(columnName);
                self.selectedCompetencyCellId(headerCellId);
                self.selectedCompetencyId(headerId);
                //Create Competency Details Module
                self.competencyModuleCreate();
                //self.competencyRegionDialogTitle(self.competencyRegionDialogTitle()+": "+columnName);
                document.getElementById('competencyDrilldownDialog').open();
            };

            this.rowHeaderStyle = function(headerContext) {
                //return 'width:150px;height:50px;background-color:#b3b3b3;font-size:12px;font-weight:bold;text-align:center;';
                var columnLength = headerContext['datasource']['columns'].length;
                var height = 60;
                if (columnLength >= 3 && columnLength <= 8) height = 50;
                return 'height:' + height + 'px;';
            };

            this.rowHeaderRenderer = function(headerContext) {
                //console.log(headerContext);
                var value = headerContext['data'];
                if (headerContext['index'] == 1 || headerContext['index'] == 2 || headerContext['index'] == 3 || headerContext['index'] == 5 || headerContext['index'] == 6 || headerContext['index'] == 7 || headerContext['index'] == 8 || headerContext['index'] == 9 || headerContext['index'] == 11 || headerContext['index'] == 12 || headerContext['index'] == 13 || headerContext['index'] == 14 || headerContext['index'] == 15) {
                    value = "";
                }
                var container = document.createElement('div');
                container.className = 'demo-content-container';
                container.appendChild(document.createTextNode(value));

                return { 'insert': container }
            };

            this.cellClassName = function(cellContext) {
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
                //Ind Specific Data Highlighting class 
                var indSpecDataClass = "ind-spec-datagrid ";

                var indPainPntHighlight = "ind-pnpt-hglgt ";

                if (classSelected == "core") {
                    if (self.scoreavgArr[data] == 1) {
                        return coreDataGridLowClass + coreDataGridClass + commmonClassList;
                    } else if (self.scoreavgArr[data] == 2) {
                        return coreDataGridMedClass + coreDataGridClass + commmonClassList;
                    } else if (self.scoreavgArr[data] == 3) {
                        return coreDataGridHighClass + coreDataGridClass + commmonClassList;
                    } else {
                        return coreDataGridClass + commmonClassList;
                    }
                }
                if (classSelected == "classic") {
                    return classicDataGridClass + commmonClassList;
                }
                if(classSelected == "indSpec"){
                    let cls = classicDataGridClass+commmonClassList;
                    if (self.indSpecfcData[data].isIndSpecfc === "Y") {
                        cls = indSpecDataClass + cls;                                                                       
                    }
                    cls = (self.indSpecfcData[data].isPainPntSelctd ? indPainPntHighlight : "") + cls;
                    return cls;
                }                
            };

            this.cellColorHighlight = function(cellContext) {
                //console.log(cellContext);
                //return 'width:150px;height:50px;font-size:10px;font-weight:bold;text-align:center;';
                if (cellContext['indexes']['column'] == 0)
                    return 'font-size:10px;font-weight:bold;text-align:center;border-left-width:0.99px;';
                else
                    return 'font-size:10px;font-weight:bold;text-align:center;';
            };

            this.cellRenderer = function(cellContext) {
                var container = document.createElement('div');
                container.className = 'cell-div-container';
                var data = cellContext['data'];
                console.log(data);
                var sourceCellId = cellContext['parentElement'].id;
                container.addEventListener("click", function() {
                    handleComponentCellClick(data, sourceCellId);
                }, false);
                container.appendChild(document.createTextNode(data));
                return { 'insert': container };
            };

            function handleComponentCellClick(data, sourceCellId) {
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
            };
            //---------Datagrid header/cell renderer functions ends--------------
            //dakshayani changes end

            /**Grid Side Panel Data Module- Start*/
            // self.gridSidePanelConfig = ko.observable({ 'view': '', 'viewModel': '' });
            // self.gridSidePanelModuleCreate = function() {                
            //     var gridSidePanelModLoad = Promise.all([
            //         moduleUtils.createView({ 'viewPath': 'views/gridSidePanel.html' }),
            //         moduleUtils.createViewModel({ 'viewModelPath': 'viewModels/gridSidePanel', 'initialize': 'always', 'params':{selectedTab:self.currentBtn()}})
            //     ]);
            //     gridSidePanelModLoad.then(
            //         function(values) {
            //             self.gridSidePanelConfig({ 'view': values[0], 'viewModel': values[1] });
            //         }
            //     );
            //     gridSidePanelModLoad.catch(
            //         function(error) {
            //             console.log("[dataGrid]: gridSidePanelModuleCreate in catch block");
            //             console.log(error);
            //         }
            //     );
            // };            
            self.gridInfoBarSelectedItem = ko.observable("info");
            self.gridInfoBarCurrentEdge = ko.observable("top");
            self.ldngPrctcPrgrsVisible = ko.observable(false);
            self.setSelectedCurrency = ko.observable(getCurrentUserCurrency());
            self.bwl = ko.observable(app.selectedBWL());
            self.localizationUrl = ko.observable(app.localizationLnk());
            self.showLocalzn = ko.observable();
            self.showLocalzn(self.localizationUrl() != "#" ? true : false);
            self.indPainPointsData = ko.observable([]);
            self.showIndpainPnts = ko.observable(false);
            self.indPainPntsDataProvider = ko.observable();
            
            //Header Level tab addition code ends

            self.closeLeadPractDialog = function (event) {
                document.getElementById('leadingPracticeDialog').close();
            }

            self.openLeadPractDialog = function (event) {
                //self.prepareLeadingPracticesData();
                document.getElementById('leadingPracticeDialog').open();
            }

            /* Org Chart Addition begins*/
            self.closeOrgChartDialog = function (event) {
                document.getElementById('orgChartDialog').close();
            }

            self.openOrgChartDialog = function (event) {
                //self.prepareLeadingPracticesData();
                document.getElementById('orgChartDialog').open();
            }
            /* Org Chart Addition ends*/

            /* Rapid move dialog*/
            self.closeRapidMoveDialog = function (event) {
                document.getElementById('orgChartDialog').close();
            }
           
            self.closeLclznDialog = function (event) {
                document.getElementById('LclznDialog').close();
            }

            function openLclznDialog(event) {
                //self.prepareLeadingPracticesData();
                document.getElementById('LclznDialog').open();
            }
            function openindPainPtSltnDialog(event) {
                //self.prepareLeadingPracticesData();
                document.getElementById('SolutionDialog').open();
            }
            self.selectPainPoint = function (evt, lineItem) {
                let alreadyOpen = false;
                let evtTarget = evt.target.nodeName;
                if (evtTarget != "A") {
                    ko.utils.arrayForEach(self.indPainPointsData(), function (item) {
                        if (item.title === lineItem.data.title && lineItem.data.showDetl()) {
                            lineItem.data.showDetl(false);
                            alreadyOpen = true;
                        }
                        item.showDetl(false);
                    });
                    if (!alreadyOpen){
                        lineItem.data.showDetl(true);
                        if(lineItem.data.mpng != 'N/A')
                        {                             
                            let mpngs = lineItem.data.mpng.split(',');                                     
                            self.selPainPointCompId(mpngs);
                            constructGridCellData(self.gridData());                            
                        }
                        else
                            emptyOutPainPtSelctn(); 
                        self.selPainPointSoltns(lineItem.data.solutions);
                    }else{
                        emptyOutPainPtSelctn();
                    }
                }
            };
            /**Empty out the Pain Point Selection */
            function emptyOutPainPtSelctn(){
                self.selPainPointCompId([]);
                constructGridCellData(self.gridData());
            }
            function constructIndPnPntData(items) {
                let _painPintsArr = [];
                ko.utils.arrayForEach(items, function (value) {
                    let painPoint = new IndPainPoint(value);
                    _painPintsArr.push(painPoint);
                });
                self.indPainPointsData(_painPintsArr);
            }

            /**Pain Point Class */
            function IndPainPoint(painPoint) {
                this.title = painPoint.title;
                this.desc = painPoint.dsc;
                this.showDetl = ko.observable(false);
                this.solutions = painPoint.soln;
                this.mpng = painPoint.mpng;
            }

            self.indPainPntsCollSync = function (method, model, options) {                
                var indPainPntsService = { url: restModule.API_URL.indPainPnts, method: "GET", data: {} };
                /*URL Parameters*/
                indPainPntsService.parameters = {};
                /*Header Parameters*/
                indPainPntsService.headers = { INDUSTRY_VAR: app.selectedIndustryCode(), DOM_CODE_VAR: app.selectedDomainCode() };
                restModule.callRestAPI(indPainPntsService, function (response) {
                    console.log("[gridSidePanel]:: Industry Pain Points Success Response");
                    if (response.items && response.items != null) {                        
                        constructIndPnPntData(response.items);
                        options["success"](self.indPainPointsData(), null, options);
                    } else {
                        options["success"](null, null, options);
                    }
                }, function (failResponse) {
                    var indPainPntsSrvcFailPrompt = "Industry Pain Points Service failure";
                    options["error"](failResponse, null, options);
                    app.showMessages(null, 'error', indPainPntsSrvcFailPrompt);
                });
            };
            function setGridSidePanel(clearPainPtMapng) {
                console.log("Grid Side Panle set up Begins--" + self.currentBtn());  
                self.localizationUrl = ko.observable(app.localizationLnk());                            
                self.showLocalzn(self.localizationUrl() != "#" ? true : false);
                self.bwl = ko.observable(app.selectedBWL());
                if (self.currentBtn() && self.currentBtn() === "indSpec") {
                    self.showIndpainPnts(true);
                    self.indpaintPntsSource.refresh();
                }else{
                    self.showIndpainPnts(false);
                }
                /** Clear the earlier cell id's of selected pain point*/
                if(clearPainPtMapng){
                    self.selPainPointCompId([]);    
                    constructGridCellData(self.gridData());
                }
                
                console.log("Grid Side Panle set up Ends--"); 
            }

            var indPainPointsModel = oj.Model.extend({
                idAttribute: 'title'
            });

            self.indPainPointsCollctn = oj.Collection.extend({
                model: indPainPointsModel
                , comparator: "title"
                , sync: self.indPainPntsCollSync
            });

            self.indpaintPntsSource = new self.indPainPointsCollctn();
            self.indPainPntsDataProvider(new CollectionDataProvider(self.indpaintPntsSource));  
            self.indPainPointSltnModule = ko.observable({ 'view': '', 'viewModel': '' });
            var indPainPtSltnModuleCreate = function() {
                var competencyDetailsModLoad = Promise.all([
                    moduleUtils.createView({ 'viewPath': 'views/indPainPointSolution.html' }),
                    moduleUtils.createViewModel({ 'viewModelPath': 'viewModels/indPainPointSolution', 'initialize': 'always', 'params': {solutions:self.selPainPointSoltns()} })
                ]);
                competencyDetailsModLoad.then(
                    function(values) {
                        self.indPainPointSltnModule({ 'view': values[0], 'viewModel': values[1] });
                    }
                );
            };
            self.getPosition = function () {
                return { my: { horizontal: "right",
                  vertical: "bottom"
                },
                at: { horizontal: "start",
                  vertical: "center"
                },
                  collision: 'flipfit'
                   };
            }.bind(this);
            self.selectIndPainPtSltn = function(evt){
                console.log(evt);
                indPainPtSltnModuleCreate();
                //openindPainPtSltnDialog();
                var popup = document.getElementById('SolutionPopup');
                popup.open('#'+evt.target.id+'div',self.getPosition());
            }
            /**Localization static html module */
            self.lclznViewModule = ko.observable({ 'view': '', 'viewModel': '' });    
            function createLclznViewModule() {
                var lclznViewModuleLoad = Promise.all([
                    moduleUtils.createView({ 'viewPath': 'views/localization.html' }),
                    moduleUtils.createViewModel({ 'viewModelPath': 'viewModels/localization', 'initialize': 'always' })
                ]);
                lclznViewModuleLoad.then(
                    function(values) {
                        self.lclznViewModule({ 'view': values[0],'viewModel':values[1] });
                    }
                );
            };
            self.lclznLnkClick = function(evt){
                console.log("Open Localization Dialog");
                createLclznViewModule();
                openLclznDialog();
                console.log("Open Localization Dialog");
            }
            /**Grid Side Panel Data Module - End*/

            /**Business Component Benchmarks Module - Start*/
            self.cmpntBenchmarksConfig = ko.observable({ 'view': '', 'viewModel': '' });
            self.bizCompKpiModuleCreate = function() {
                var cmpntBenchmarksModLoad = Promise.all([
                    moduleUtils.createView({ 'viewPath': 'views/componentBenchmarks.html' }),
                    moduleUtils.createViewModel({ 'viewModelPath': 'viewModels/componentBenchmarks', 'initialize': 'always', 'params': { selectedBizCompId: self.selectedBizCompId() } })
                ]);
                cmpntBenchmarksModLoad.then(
                    function(values) {
                        self.cmpntBenchmarksConfig({ 'view': values[0], 'viewModel': values[1] });
                    }
                );
            };
            /**Business Component Benchmarks Module - End*/

            /**Business Component Controls Module - Start*/
            self.cmpntControlsConfig = ko.observable({ 'view': '', 'viewModel': '' });
            self.bizCompCntrlModuleCreate = function() {
                var cmpntControlsModLoad = Promise.all([
                    moduleUtils.createView({ 'viewPath': 'views/componentControls.html' }),
                    moduleUtils.createViewModel({ 'viewModelPath': 'viewModels/componentControls', 'initialize': 'always', 'params': { selectedBizCompId: self.selectedBizCompId() } })
                ]);
                cmpntControlsModLoad.then(
                    function(values) {
                        self.cmpntControlsConfig({ 'view': values[0], 'viewModel': values[1] });
                    }
                );
            };
            /**Business Component Controls Module - End*/

            /**Business Component Assets Module - Start*/
            self.cmpntAssetsConfig = ko.observable({ 'view': '', 'viewModel': '' });
            self.bizCompAssetModuleCreate = function() {
                var cmpntAssetsModLoad = Promise.all([
                    moduleUtils.createView({ 'viewPath': 'views/componentAssets.html' }),
                    moduleUtils.createViewModel({ 'viewModelPath': 'viewModels/componentAssets', 'initialize': 'always', 'params': { selectedBizCompId: self.selectedBizCompId() } })
                ]);
                cmpntAssetsModLoad.then(
                    function(values) {
                        self.cmpntAssetsConfig({ 'view': values[0], 'viewModel': values[1] });
                    }
                );
            };
            /**Business Component Assets Module - End*/

            self.backToSearch = function() {
                //app.loadSearchPortalModule();
                oj.Router.rootInstance.go('searchPortal');
            };
            /**Rapid Move Dialog */
            self.openRapidMoveDialog = function(event) {
                    //self.prepareLeadingPracticesData();
                    document.getElementById('rapidMoveDialog').open();
                }
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
                console.log("[dataGrid]: connected begins");

                /**Initialize page parameters */
                self.currentModuleParams();

                /**Set Data Grid Header based on Context */
                self.setGridHeader();

                /**Populate Grid Data*/
                //self.prepareGridData();
                self.loadDataGrid();

                app.updateCntrlrObjsFrmSession();
                
                /**Initialize child modules */
                //self.gridSidePanelModuleCreate();
                setGridSidePanel();
                self.leadingPracticesModuleCreate();
                self.orgHeirarchyModuleCreate();
                self.rapidMoveModuleCreate();                

                let screenWidth = screen.width;
                
                if(screenWidth < 1400) {
                    self.gridScale("oj-flex-item oj-sm-9 oj-md-9 oj-lg-9");
                    self.gridSidePanelScale("oj-flex-item oj-sm-3 oj-md-3");
                } 
                if(screenWidth < 1024) {
                    self.gridScale("oj-flex-item oj-sm-8 oj-md-8 oj-lg-8");
                    self.gridSidePanelScale("oj-flex-item oj-sm-4 oj-md-4");
                }              
                console.log("[dataGrid]: connected ends");
            };

            /**
             * Optional ViewModel method invoked after the View is disconnected from the DOM.
             */
            self.disconnected = function() {
                // Implement if needed
                console.log("[dataGrid]: Inside Disconnected");
            };

            /**
             * Optional ViewModel method invoked after transition to the new View is complete.
             * That includes any possible animation between the old and the new View.
             */
            self.transitionCompleted = function() {
                // Implement if needed
            };


        }

        /*
         * Returns a constructor for the ViewModel so that the ViewModel is constructed
         * each time the view is displayed.  Return an instance of the ViewModel if
         * only one instance of the ViewModel is needed.
         */
        //return DataGridViewModel;
        return new DataGridViewModel();
    }
);