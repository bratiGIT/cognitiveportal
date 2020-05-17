define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojmodel', 'ojs/ojkeyset', 'restModule', 'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojtable'],
    function (oj, ko, $, app, Model, keySet, restModule, ArrayDataProvider) {
        /** This module will not return a new instance of it. Wherever this module is required, 
         * createViewModule can be used to instantiate it. This is loaded in dataGrid page*/
        return function RapidMoveViewModel() {
            console.log("Rapid Move View Model");
            var self = this;

            /**Legend Data */
            self.rapdMvLegnd = ko.observable([{ text: "60%+", class: "_60Savng" }, { text: "40%+", class: "_40Savng" }, { text: "20%+", class: "_20Savng" }]);

            /**Heat Map classes */
            const HeatClass = {
                LOW: "rapidLow",
                MEDIUM: "rapidMEDIUM",
                HIGH: "rapidHigh"
            }
            /**Static Columns */
            self.static_columns = ["strtupflg", "dscvryflg", "dlvryflg", "trnstnflg", "rlztnflg"];
            /**Column Prototype */
            function Column(col) {
                this.val = [{value:col.val,lnk:col.lnk}];
                this.saving = col.saving;
                this.cols = col.cols;
                this.setColSpan();                
            }
            Column.prototype.savingClass = function () {
                return ((this.saving >= 20 && this.saving < 40) ? HeatClass.LOW : (this.saving >= 40 && this.saving < 60) ? HeatClass.MEDIUM : (this.saving >= 60) ? HeatClass.HIGH : "");
            }
            Column.prototype.activeLinks = function () {
                let count = 0;
                this.val.forEach((eachVal => {
                    count += (eachVal.lnk == "" || eachVal.lnk == "#") ? 0 : 1; 
                }));
                return count;
            }
            Column.prototype.setColSpan = function () {
                let colSpan = 0;
                let cols = this.cols;
                self.static_columns.forEach(function (column) {
                    if (cols[0][column] === "True")
                        colSpan += 1;
                });
                this.colSpan = colSpan;
            };
            /**Row Prototype */
            function Row(element) {
                this.taskname = element.taskname;
                this.vals = { "strtupflg": "", "dscvryflg": "", "dlvryflg": "", "trnstnflg": "", "rlztnflg": "" };
                this.analyseAndPushData = function (col) {
                    //let firstColName = Object.keys(col.cols[0])[0];
                    let firstColFound = false;
                    for (var prop in col.cols[0]) {
                        if ((col.cols[0][prop] === 'True') && !firstColFound) {
                            if (this.vals[prop] === "") {
                                this.vals[prop] = col;                                
                            } else {
                                // this.vals[prop].val = eval('`' + this.vals[prop].val + ` 
                                // `+ col.val + '`');
                                this.vals[prop].val.push({value:col.val[0].value,lnk:col.val[0].lnk});
                            }
                            firstColFound = true;

                        }
                        else if (col.cols[0][prop] === 'True')
                            delete this.vals[prop];
                    }                    
                };                
            }

            self.rapidMove = ko.observable([]);
            self.rapidMoveHdr = ko.observable({STRTUPFLG:ko.observable(),DSCVRYFLG:ko.observable(),DLVRYFLG:ko.observable(),TRNSTNFLG:ko.observable(),RLZTNFLG:ko.observable()});
            loadRapidMove();
            loadRapidMoveHdr();

            /**Load Rapid Move data */
            function loadRapidMove() {                
                var rapidMoveService = { url: restModule.API_URL.getRapidMove, method: "GET", data: {} };
                rapidMoveService.parameters = {};
                restModule.callRestAPI(rapidMoveService, function (response) {
                    if (response.items && response.items != null) {                            
                        constructRapidMoveData(response.items);
                    } else {
                        console.log("Empty response in leading practices service");
                    }
                }, function (failResponse) {
                    var rapidMoveFailPrompt = "Lead Practice Service failure";
                    console.log(failResponse);
                    app.showMessages(null, 'error', rapidMoveFailPrompt);
                });
                console.log("Load Rapid Move");                
            }
            /**Construct Rapid move data */
            function constructRapidMoveData(data) {
                let rapidMoveDataTmp = [];                
                data.forEach((element) => {                  
                    let existingRow = getExistingTask(rapidMoveDataTmp, element.taskname);
                    let row = null;
                    let existing = true;
                    if (existingRow[0])
                        row = existingRow[0];
                    else {
                        existing = false;
                        row = new Row(element);
                    }
                    /**Create a Column */
                    let col = new Column(element);                    
                    /**Analyse and push the colum data */
                    row.analyseAndPushData(col);
                    if (!existing) {
                        rapidMoveDataTmp.push(row);
                    }                
                });
               // console.log(rapidMoveDataTmp);
                self.rapidMove(rapidMoveDataTmp);
            }
            
            function getExistingTask(rapidMoveDataTmp, taskname) {
                var existingRow = ko.utils.arrayFilter(rapidMoveDataTmp, function (item) {
                    return (item.taskname === taskname);
                });
                return existingRow;
            }
            
            /**Load Rapid Move Header */
            function loadRapidMoveHdr(){
                var rapidMoveHdrService = { url: restModule.API_URL.getRapidMoveHdrs, method: "GET", data: {} };
                rapidMoveHdrService.parameters = {};
                restModule.callRestAPI(rapidMoveHdrService, function (response) {
                    if (response.items && response.items != null) {                        
                        constructRpdMovHdr(response.items);
                    } else {
                        console.log("Empty response in leading practices service");
                    }
                }, function (failResponse) {
                    var rapidMoveFailPrompt = "Rapid Move Hdr Service failure";
                    console.log(failResponse);
                    app.showMessages(null, 'error', rapidMoveFailPrompt);
                });
            }

            /**Construct header data */
            function constructRpdMovHdr(hdrData){                             
                $.each(hdrData,function(key,val){
                    self.rapidMoveHdr()[val.flgname](val.lnk);
                });                
            }


        }
    });