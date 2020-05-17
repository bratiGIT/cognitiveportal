define(['ojs/ojcore', 'knockout', 'jquery', 'appController','restModule','orgchart'],  
    function (oj, ko, $,app,restModule,orgchart) {  
        /** 
     * The view model for the main content view template 
     */  
    function orgchartViewModel(){
         var self = this;
         self.selectedDomainCode = app.selectedDomainCode();
                  
         let procLegendData = [{text:"Purchase to Pay",class:"p2pLeg"},{text:"Core Finance",class:"coreFinLeg"},{text:"RPA/Cognitive Enabled",class:"cognitiveLeg"},{text:"External Org",class:"extOrgLeg"}];       
         let finLegendData = [{text:"Core Finance",class:"p2pLeg"},{text:"Purchase to Pay",class:"coreFinLeg"},{text:"RPA/Cognitive Enabled",class:"cognitiveLeg"}];       
         let hcmLegendData = [{text:"HR  ",class:"p2pLeg"},{text:"RPA/Cognitive Enabled",class:"cognitiveLeg"}];       
         let scmLegendData = [{text:"SCM   ",class:"p2pLeg"},{text:"RPA/Cognitive Enabled",class:"cognitiveLeg"}];   
         let o2cLegendData = [{text:"Order to Cash",class:"p2pLeg"},{text:"Core Finance",class:"coreFinLeg"},{text:"SCM",class:"thirdLeg"},{text:"RPA/Cognitive Enabled",class:"cognitiveLeg"}];       

         self.legendData=ko.observable([]);
         if(app.selectedDomainCode() === 'DOM002')
            this.legendData(finLegendData);
         else if(app.selectedDomainCode() === 'DOM003')
            this.legendData(hcmLegendData);
         else if(app.selectedDomainCode() == 'DOM007')
            this.legendData(scmLegendData);  
         else if(app.selectedDomainCode() == 'DOM005')
            this.legendData(o2cLegendData);        
         else
            this.legendData(procLegendData);         

         fetchOrgHeirarchy();          
         function fetchOrgHeirarchy() {
            var orgHeirarchyService = { url: restModule.API_URL.viewOrgChart, method: "GET", data: {} };
            orgHeirarchyService.parameters = {};
            orgHeirarchyService.headers = { DOM_CODE_VAR: app.selectedDomainCode() };
            restModule.callRestAPI(orgHeirarchyService, function (response) {                
                if (response.items && response.items != null) {
                    console.log("[orgHeirarchy]: Org Heirarchy response fetched successfully");                    
                    constructOrgHeirarchy(response.items);                                    
                } else {                    
                    console.log("[orgHeirarchy]: No Org Heirarchy defined for the current domain");
                }
            }, function (failResponse) {
                var orgHeirarchySrvcFailPrompt = "Org Chart Service Call Failed";
                console.log(failResponse);                
                app.showMessages(null, 'error', orgHeirarchySrvcFailPrompt);
            });
        };

        /**Construct the org hcart data in required structure */
        function constructOrgHeirarchy(data){
            let orgHeirarchy = {name:'', children:[]};
            let missedItems = [];
            data.forEach((element) => {
                if(element.prnt === 'Root'){
                    let rdesct = element.rdesc ? element.rdesc : element.rnm;
                    orgHeirarchy.name = element.rnm;
                    orgHeirarchy.rdesc = rdesct;
                }
                else if(element.prnt === orgHeirarchy.name){
                    orgHeirarchy.children.push(getNode(element));
                }
                else{   
                    var prnt = element.prnt;
                    if(element.prnt.includes("#NA")){
                        var _splitd = element.prnt.split("#NA");
                        prnt = _splitd[0];
                    }                                    
                    orgHeirarchy.children = findParentAndAddChild(orgHeirarchy.children,prnt,element);
                }                
            });            
            /**This below commented template is to put a plus icon at the bottom of each node to indicate whether it has a child or not */
          //   `                  
          //   <div class="title"><div style="margin:auto">${data.name}</div><i style="${data.children.length > 0 ? '' : 'display:none'}" class="toggleBtn fa fa-plus-square"></i></div>
          // `
            var nodeTemplate = function(data) {
                return `                  
                  <div class="title"><div style="margin:auto">${data.name}<span class="tooltiptext">${data.rdesc}</span></div></div>
                `;
              };
            $('#chart-container').orgchart({
                'data' : orgHeirarchy,
                'nodeContent': 'title',
                'verticalLevel': (app.selectedDomainCode() === "DOM002" ? 5 : 6), 
                'visibleLevel': (app.selectedDomainCode() === "DOM002" ? 3 : app.selectedDomainCode() === "DOM003" ? 4 : 6),
                'nodeTemplate': nodeTemplate,
                zoom: true,
                pan: true
                // ,'direction': 'l2r' --Direction left to right requires lotsof customization on css to fit the nodes with sizes
                
              });
              $('.orgchart').removeClass('noncollapsable');
        } 

        /**Find the parent and attach the child node */
        function findParentAndAddChild(children,name,elementToBeAdded){
            children.forEach((child) => {
                
                if(child.name === name){
                    let childs = child.children ? child.children : [];
                    childs.push(getNode(elementToBeAdded));
                    child.children = childs;
                    return children;
                }
                else if(child.children)
                    findParentAndAddChild(child.children,name,elementToBeAdded);                
            });            
            return children;
        }

        /**Node definition */
        function getNode(element){
            if(element.rnm === 'Regional/Local/Departmental Finance Director')
                element.rnm = 'Regional/ Local/ Departmental Finance Director'
            let rdesct = element.rdesc ? element.rdesc : element.rnm;
            let node = {name:element.rnm,rdesc:rdesct,className:'',children:[]};
            /**Cognitive style */
            if(element.cog === "Y"){                
                node.className = 'cognitive';                 
            }
            /**Other domain style */
            if(element.dom !== app.selectedDomainCode() && element.dom == 'DOM007')
                node.className = node.className+' domain2';  
            else if(element.dom !== app.selectedDomainCode())
                node.className = node.className+' domain1';
            /**Root node style */          
            if(element.prnt === 'Root')
                node.className = node.className+' rootNode';
            /**External Org style */
            if(element.rnm === "Legal Counsel/ Support" || element.prnt.includes("#NA")){
                node.className = (element.cog === "Y" ? "cognitiveExtOrg" : node.className+' externalOrg');                
            }
            /**To make a specific node alone to be collapsed at the initial render */
            // if(app.selectedDomainCode() === 'DOM002' && (element.rnm === 'Head of Finance Operations' || element.rnm === 'Head of Project Office'))
            //     node.collapsed = true;
                
            return node;
        }
        

    }
  
    return orgchartViewModel;  
});  