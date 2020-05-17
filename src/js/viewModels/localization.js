define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojmodel', 'ojs/ojkeyset', 'restModule', 'ojs/ojarraydataprovider', 'ojs/ojlistdataproviderview',
        'ojs/ojknockouttemplateutils','ojs/ojknockout', 'ojs/ojtable','ojs/ojgauge','ojs/ojprogress'],
    function (oj, ko, $, app, Model, keySet, restModule, ArrayDataProvider,ListDataProviderView,KnockoutTemplateUtils) {
        /** This module will not return a new instance of it. Wherever this module is required, 
         * createViewModule can be used to instantiate it. This is loaded in dataGrid page*/
        return function LocalizationViewModel() {
            console.log("Rapid Move View Model");
            var self = this;
            /** */
            self.filter = ko.observable();
            self.lclznPrgrsVisible = ko.observable(false);
            self.localznArray = ko.observable([]);            
            self.localznDataProvider = ko.computed(function () {               
                    var filterRegEx = new RegExp(self.filter(), 'i');
                    var filterCriterion = {
                        op: '$or',
                        criteria: [{ op: '$regex', value: { cntry: filterRegEx } }]
                    };
                    var arraylocalznDataProvider = new ArrayDataProvider(self.localznArray(), { keyAttributes: 'country' });
                    return new ListDataProviderView(arraylocalznDataProvider, { filterCriterion: filterCriterion });
               
            }, this);

            self.filterInChngd = function () {
                self.filter(document.getElementById('filter').rawValue);
            }.bind(this);

            // eslint-disable-next-line no-unused-vars
            self.clearClick = function (event) {
                self.filter('');
                return true;
            }.bind(this);

            
            self.custFtmntIdxLabel = ko.observable({rendered:'on',textType: 'percent', style:{fontWeight:'bold',color:'blue'}});

            self.columnArray = [{
                headerText: 'Region',
                renderer: KnockoutTemplateUtils.getRenderer('rgn', true)
            },
            {
                headerText: 'Country',
                renderer: KnockoutTemplateUtils.getRenderer('cntry_flag', true),
                className: "flagCol"
            },                        
            {
                headerText: 'Fitment Index',
                renderer: KnockoutTemplateUtils.getRenderer('ftmnt_idx', true),
                className: "flagCol"
            },
            {
                headerText: 'Challenge',
                renderer: KnockoutTemplateUtils.getRenderer('chllnge', true)
            }
            ];

            self.constructLclznData = function(){
                console.log("[Localization]:constructLclznData");
                var localizationService = { url: restModule.API_URL.localization, method: "GET", data: {} };
                localizationService.parameters = {};
                localizationService.headers = { DOMAIN_CODE_VAR: app.selectedDomainCode() };  
                self.lclznPrgrsVisible(true);                                             
                restModule.callRestAPI(localizationService, function (response) {
                    if (response.items && response.items != null) {  
                        console.log(response.items);
                        let lclzns = [];                        
                        response.items.forEach(function(item,index){
                            let lclznRow = new lclzn(item);
                            lclzns.push(lclznRow);                            
                        });                        
                        self.localznArray(lclzns);                         
                        self.lclznPrgrsVisible(false);
                    } else {
                        console.log("Empty response in localization service");
                        self.lclznPrgrsVisible(false);
                    }
                    
                }, function (failResponse) {     
                    self.lclznPrgrsVisible(false);               
                    var lclztnFailPrompt = "Lead Practice Service failure";
                    console.log(failResponse);
                    app.showMessages(null, 'error', lclztnFailPrompt);
                });
            }

            self.constructLclznData();
          
            function lclzn(item){
                this.cntry = item.cntry;
                this.flag = item.flag;
                this.ftmtindx = parseInt(item.ftmtindx);
                this.challenge = item.challenge;
                this.loclink = item.loclink;
                this.rgn = item.rgn;
            }
        }
    });