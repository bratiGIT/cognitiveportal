define(['accUtils','knockout', 'appController','restModule','ojs/ojarraydataprovider', 'ojs/ojnavigationlist','ojs/ojswitcher',
        'ojs/ojradioset','ojs/ojchart','ojs/ojlegend'],
 function(accUtils,ko,app,RestModule,ArrayDataProvider) {

    function SurveyChartViewModel(params) {
      var self = this;
    
      self.chartStyle = ko.observable("chart mainChrt");//smallSurvyChrt - for small chart in CBM
      self.selectionMode = ko.observable("single");
      self._survy_polar_data = ko.observableArray([]);
      self.survydata = ko.observableArray([]);      
      self.chrtDataProvider = new ArrayDataProvider(self._survy_polar_data, {keyAttributes: 'id'});
      self.lgndOrientn = ko.observable("vertical");
      var legendData = ko.observableArray([{label: "IBM",color:"#00539A"},{label: "Standard SaaS",color:"#C20104"},{label: app.loggedInClient(),color:"#00801B"}]);
      self.legendDataPrvdr = new ArrayDataProvider(legendData, {keyAttributes: 'fruit'});
      var chartLoadSignal = params.chartLoadSignal;
      /**Load signal from parent */
      if(chartLoadSignal != undefined){
      chartLoadSignal.add(function(survy_data,takeFrmSession) {
        console.log("Chart load Signal -- "+survy_data); 
        /**Invoke Service */
        loadChartDataFrmSrvc();
      });
     }
      var loadChartDataFrmSrvc = () => {
        var assmntAvgSerive = { url: RestModule.API_URL.getAssmntAvgData, method: "GET", data: {} };
        assmntAvgSerive.parameters = {};
        assmntAvgSerive.headers = { INDUSTRY_VAR: app.selectedIndustryCode(), DOMAIN_VAR: app.selectedDomainCode(), CLIENT_NAME: app.loggedInClient() };
        RestModule.callRestAPI(assmntAvgSerive, function (response) {
          if (response.items && response.items != null) {
            constructPolarData(response.items);           
          } else {
          }
        }, function (failResponse) {
          console.log(failResponse);
        }); 
      }
      var constructPolarData = (items)=>{    
         self._survy_polar_data([]); 
         $.each(items,function(idx,value){
          let seriesItm = new ClientSeries(idx,value.subject == 'ORACLE' ? 'Standard SaaS' : value.subject,value.maturitylevel[0]);
          self._survy_polar_data.push(seriesItm);    
         });
         setInSession("polar_data",self._survy_polar_data());
      }     
      function ClientSeries(id,series,data){        
        this.id = id;
        this.seriesId = series;        
        this.groupId = [data.comp_name];
        var calculateVal = (ansrs) =>{
          let total = 0;
          $.each(ansrs,function(idx,val){
            console.log(val.scr);
            if(val.scr() == "")
              total += 0;   
            else
              total += val.scr();                        
          });
          return (total/data.questions.length) ;
        };
        this.value = data.avg_score;        
      };
      self.slctdPolarItm = ko.observable();
      self.slctdPolarItm.subscribe(function(val){        
        let _selecteddata = self._survy_polar_data()[val[0]];
        app.slctdPolarItm({comp_name:_selecteddata.groupId[0]});
        app.frmScreen("survy");
        app.router.go("dataGrid");
      });

      self.connected = function() {
           console.log("chart connected");
           /*TODO: takeFrmSession parameter name should be changed, as chart data is no longer retrieved from session */
            loadChartDataFrmSrvc();
            if(params.smallChart){              
              self.chartStyle("chart smallSurvyChrt");
              self.selectionMode("none");
            }
            if(params.legendHorzntl){     
              console.log("horizontal survey legend");         
              self.lgndOrientn("horizontal");
              $('#survyLgnd').addClass('smallSurvyChartLegnd');              
              $('#survyLgndDiv').addClass('smallSurvyChartLegndDiv');
            }
            else{
              console.log("vertical survey legend");
              $('#survyLgnd').addClass('bigSurvyChartLegnd');
              $('#survyLgndDiv').addClass('bigSurvyChartLegndDiv');
            }     
      }
    }
    return SurveyChartViewModel;
});