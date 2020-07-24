define(['accUtils','knockout', 'appController','restModule','ojs/ojarraydataprovider','ojs/ojnavigationlist','ojs/ojswitcher',
        'ojs/ojradioset','ojs/ojchart','ojs/ojlegend','ojs/ojswitcher','ojs/ojbutton'],
 function(accUtils,ko,app,RestModule,ArrayDataProvider) {

    function SurveyChartViewModel(params) {
      var self = this;
    
      self.chartStyle = ko.observable("chart mainChrt");//smallSurvyChrt - for small chart in CBM
      self.selectionMode = ko.observable("single");
      self._survy_polar_data = ko.observableArray([]);
      self._multi_polar_data = ko.observableArray([]);
      self.survydata = ko.observableArray([]);      
      self.chrtDataProvider = new ArrayDataProvider(self._survy_polar_data, {keyAttributes: 'id'});
      self.lgndOrientn = ko.observable("vertical");
      var clientLgnd = [{label: "YOU",color:"#00801B"}];
      var otherLgnd = [{label: "Standard SaaS",color:"#C20104"},{label: "Cognitive Enterprise",color:"#00539A"}];
      self.sngleChrtClntAvlbl = ko.observable(false);
      self.multiChrtClntAvlbl = ko.observable(false);
      var legendData = ko.observableArray([]);
      self.legendDataPrvdr = new ArrayDataProvider(legendData, {keyAttributes: 'label'});
      self.multiChart = ko.observable("single");
      self.multiChartCntrlEnable = ko.observable(false);
      self.showDomainHdr = ko.observable(false);
      self.inddomain = ko.observable({domain:"",ind:""});
      self.chrtGroupTitle = ko.observable({"white-space":"normal"});
      var chartLoadSignal = params.chartLoadSignal;
      /**Load signal from parent */
      if(chartLoadSignal != undefined){
      chartLoadSignal.add(function(survy_data,takeFrmSession) {         
        /**Invoke Service */
        loadChartDataFrmSrvc();
      });
     }
     /**Load chart data for all domains of an industry */
     var loadChartDataOfAllDomains = () => {
       var assmntAvgSerive = { url: RestModule.API_URL.getAssmntAvgOfDomains, method: "GET", data: {} };
       assmntAvgSerive.parameters = {};
       assmntAvgSerive.headers = { INDUSTRY_VAR: app.selectedIndustryCode(), CLIENT_NAME: app.loggedInClient() };
       RestModule.callRestAPI(assmntAvgSerive, function (response) {
         if (response.items && response.items != null) {           
           constructMultiPolarData(response.items);
         } else {
         }
       }, function (failResponse) {
         /**Error in service call */
       }); 
      }
      /**Load chart data for one industry and domain */
      var loadChartDataFrmSrvc = () => {
        var assmntAvgSerive = { url: RestModule.API_URL.getAssmntAvgData, method: "GET", data: {} };
        assmntAvgSerive.parameters = {};
        assmntAvgSerive.headers = { INDUSTRY_VAR: app.selectedIndustryCode(), DOMAIN_VAR: app.selectedDomainCode(), CLIENT_NAME: app.loggedInClient() };
        RestModule.callRestAPI(assmntAvgSerive, function (response) {
          if (response.items && response.items != null) {
            constructPolarData(response.items);  
            //wrapText();         
          } else {
          }
        }, function (failResponse) {
          /**Error in service call */
        }); 
      }
      /**Construct chart data */
      var constructPolarData = (items)=>{    
         self._survy_polar_data([]); 
         $.each(items,function(idx,value){
           if(value.subject == app.loggedInClient())
             self.sngleChrtClntAvlbl(true);
          let seriesItm = new ClientSeries(idx,value.subject == 'ORACLE' ? 'Standard SaaS' : value.subject,value.maturitylevel[0]);
          self._survy_polar_data.push(seriesItm);    
         });
         setInSession("polar_data",self._survy_polar_data());  
         constructLgnd();      
      }  
      /**Construct multi chart data */
      var constructMultiPolarData = (items)=>{
        self._multi_polar_data([]);
        let multiPolarData = {};
        $.each(items,function(idx,value){
          if(value.subject == app.loggedInClient())
             self.multiChrtClntAvlbl(true);
          let seriesItm = new ClientSeries(idx,value.subject == 'ORACLE' ? 'Standard SaaS' : value.subject,value.maturitylevel[0]);
          if(multiPolarData[value.domain]){
            multiPolarData[value.domain].chartData.push(seriesItm);
          }else{
            multiPolarData[value.domain] = {domName:value.dom_name,chartData:[]};
            multiPolarData[value.domain].chartData.push(seriesItm);
          }                    
        });
        $.each(multiPolarData,function(idx,val){
          self._multi_polar_data.push({domName:val.domName,chartData:new ArrayDataProvider(val.chartData, {keyAttributes: 'id'})});
        });        
        constructLgnd(); 
      }   
      function ClientSeries(id,series,data){        
        this.id = id;
        this.seriesId = series;        
        this.groupId = [data.comp_name];
        var calculateVal = (ansrs) =>{
          let total = 0;
          $.each(ansrs,function(idx,val){            
            if(val.scr() == "")
              total += 0;   
            else
              total += val.scr();                        
          });
          return (total/data.questions.length) ;
        };
        this.value = data.avg_score;        
      };
      /**Construct legend - if client data unavailable do not show client in legend */
      function constructLgnd(){
        legendData([]);
        if((self.multiChart() == 'single' && self.sngleChrtClntAvlbl()) || (self.multiChart() == 'multi' && self.multiChrtClntAvlbl()))                 
            ko.utils.arrayPushAll(legendData, clientLgnd);                    
         ko.utils.arrayPushAll(legendData, otherLgnd);  
      }
      self.multiChart.subscribe(function(singleMulti){
        constructLgnd();
      });
      self.slctdPolarItm = ko.observable();
      self.slctdPolarItm.subscribe(function(val){        
        let _selecteddata = self._survy_polar_data()[val[0]];
        app.slctdPolarItm({comp_name:_selecteddata.groupId[0]});
        app.frmScreen("survy");
        app.router.go("dataGrid");
      });
      // /**SVG Text wrap */
      /* function wrapText(){
        var svg = document.getElementsByTagName('svg');
        if(svg.length > 0){
          console.log(svg);
        for(let i=0;i<svg.length;i++){
          let svgItm = svg[i];
          var textElem = svgItm.querySelectorAll("text");
          console.log(textElem);
          if(textElem.length > 0){
            for(let j=0;j<textElem.length;j++){
              let txtElem = textElem[j];
              console.log(txtElem.textContent);
              if(txtElem.textContent.indexOf("..") == txtElem.textContent.length -2){
                console.log(..);
              }
            }
          }
        }
        }
        
      }*/
      self.connected = function() {           
           app.updateCntrlrObjsFrmSession();/*to update the common parameters from session*/       
           clientLgnd[0].label = app.selChrtClientVal();
           self.inddomain({domain:app.selectedDomainTxt(),ind:app.selectedIndustryTxt()});
            loadChartDataFrmSrvc();
            if(params.smallChart){              
              self.chartStyle("chart smallSurvyChrt");
              self.selectionMode("none");
            }
            if(params.legendHorzntl){                         
              self.lgndOrientn("horizontal");
            }
            else{
              self.lgndOrientn("vertical");
            } 
            if(params.multiEnable){
              //call multi chart service
               self.multiChartCntrlEnable(true);
               loadChartDataOfAllDomains();
            }    
      }
    }
    return SurveyChartViewModel;
});