/* @author : Priyadarsini T B
   @Created : 03-Dec-2019
 */
define(['ojs/ojcore', 'knockout', 'jquery'], function (oj, ko, $) {

    //var url ='http://129.213.70.213:9781/findEmployee?username=' + self.username();
    //var url = 'http://129.213.70.213:9781/api/v1/employee/query?username='+ self.username();
    //var url = 'https://cors-anywhere.herokuapp.com/129.213.70.213:9781/api/v1/employee/query?username='+ self.username(); 
    //var url = 'http://b896aa50.ngrok.io/api/v1/employee/query?username=Alex.Martin'
    //var _baseUrl = "http://129.213.70.213:9781/api/v1/";
    //var _baseUrl = "https://cors-anywhere.herokuapp.com/129.213.70.213:9781/api/v1/";
    
    function RestModule() {
        
        var self = this;
        
        var token = getLoggedInBtoa();        
		
        /** This is used in login to generate the basic auth token and later will be used on all further calls
			var token = 'Basic ' + btoa(self.username().trim() + ':' + self.password());
		**/
        self.token = ko.observable(token);
        self.updateToken = function(token){
            self.token(token);
        }

        self.callRestAPI = function (service, sucessCallBack, failureCallBack) {
            //service.url = _baseUrl + service.url;
            /*URL Parameter Parsing*/
            var urlParameters = "";
            if (service.parameters) {
                $.each(service.parameters, function (key, value) {
                    if (urlParameters.length > 0)
                        urlParameters += '&' + key + '=' + value;
                    else
                        urlParameters += '?' + key + '=' + value;
                });
            }
            console.log(urlParameters);
            
            /* Setting auth token can be enabled after basic auth is setup*/
            if(service.url.includes(self.ORDS_REST_BASE_URI))
            {   
                //console.log("[restModule]: Inside URL check");
                //console.log(self.token());
                
                if(self.token())
                {
                    //console.log("[restModule]: Token present");
                    if (service.headers){
                     service.headers['Authorization'] = self.token();
                     //console.log("[restModule] : Appended Auth Header")
                    } else{
                     //console.log("[restModule] : Inserted Auth Header")
                     service.headers = { Authorization: self.token() };
                    }
                }     
            }
            let ajaxReq = {
                url: service.url + urlParameters,
                type: service.method,
                //contentType: 'application/json',
                data: service.data,
                beforeSend: function (xhr) {
                    if (service.headers) {
                        $.each(service.headers, function (key, value) {
                            xhr.setRequestHeader(key, value);
                        });
                    }
                }
            }
            if(ajaxReq.type == "POST"){
                ajaxReq.contentType = "application/json";
            }
            $.ajax(ajaxReq).done(function (result) {
                sucessCallBack(result);
            }).fail(function (response) {
                failureCallBack(response);
            });
        }

        console.log("context path:");
        console.log(window.location.href);
        let host = window.location.href;        
        //self.ORDS_REST_BASE_URI = "http://129.150.172.40:8080/ords";
        self.ORDS_REST_BASE_URI = "http://129.213.116.85:8080/ords/"+ ( (host.includes("Dev") || host.includes("localhost")) ? "portal_workspace_dev" : "portal_workspace") ;
        
        self.API_URL = {

            //"login": "",

            /*query services*/
             "viewDataGrid"         : self.ORDS_REST_BASE_URI+"/xxibm_portal_grid/fetchGridDataByDomain/"
            ,"viewComponentKpis"    : self.ORDS_REST_BASE_URI+"/xxibm_portal_mstr_data_view/xxibm_portal_mstr_ibv_kpi_view_get/"
			,"viewComponentControls": self.ORDS_REST_BASE_URI+"/xxibm_portal_controls_risks/xxibm_portal_controls_risks_get/"
            ,"viewComponentAssets"  : self.ORDS_REST_BASE_URI+"/xxibm_portal_rpa_assets/xxibm_portal_rpa_assets_get/"
            ,"viewLeadingPractices" : self.ORDS_REST_BASE_URI+"/xxibm_portal_leading_practices/xxibm_portal_leading_practices_get/"
            ,"viewCompetencyKpis"   : self.ORDS_REST_BASE_URI+"/xxibm_portal_comptncy_kpi/xxibm_portal_comptncy_kpi_get/"
            ,"viewCompetencyRoles"  : self.ORDS_REST_BASE_URI+"/xxibm_portal_comp_to_role_map/xxibm_portal_comp_to_role_map_get/"
            ,"viewCompetencyModules": self.ORDS_REST_BASE_URI+"/xxibm_portal_competency_module/xxibm_portal_competency_module_get/"
            ,"viewOrgChart"         : self.ORDS_REST_BASE_URI+"/xxibm_portal_org_chart/xxibm_portal_org_chart_get/"
            ,"getCompetencies"      : self.ORDS_REST_BASE_URI+"/xxibm_portal_competency/xxibm_portal_competency_get/"
            ,"getDomains"           : self.ORDS_REST_BASE_URI+"/xxibm_portal_domain_map/xxibm_portal_domain_map_get/"
            ,"getIndustries"        : self.ORDS_REST_BASE_URI+"/xxibm_portal_industry_map/xxibm_portal_industry_map_get/"
            ,"getCurrencies"        : self.ORDS_REST_BASE_URI+"/xxibm_portal_currency_master/xxibm_portal_currency_master_get/"
            ,"getCurrencyRate"      : "https://free.currconv.com/api/v7/convert"
            ,"getRapidMove"         : self.ORDS_REST_BASE_URI+"/xxibm_portal_rapid_move/xxibm_portal_rapid_move_get/"
            /*validate services*/
            ,"validateUserLogin"    : self.ORDS_REST_BASE_URI+"/xxibm_portal_auth/xxibm_portal_auth_get/"
            ,"getRapidMoveHdrs"     : self.ORDS_REST_BASE_URI+"/xxibm_portal_rapid_move_flg/xxibm_portal_rapid_move_flg_get/"
            , "indPainPnts"         : self.ORDS_REST_BASE_URI+"/xxibm_portal_pain_points/get_pain_points_data/"
            , "localization"        : self.ORDS_REST_BASE_URI+"/xxibm_portal_localization_map/xxibm_portal_localization_map_get/"
            ,"selfAssesmnt"         : self.ORDS_REST_BASE_URI+"/xxibm_portal_questions/xxibm_portal_questions_get/"
            ,"storeQuestns"         : self.ORDS_REST_BASE_URI+"/xxibm_portal_questions/xxibm_portal_maturity_score_summary_post"            
            ,"getAssmntAvgData"     : self.ORDS_REST_BASE_URI+"/xxibm_portal_questions/xxibm_portal_maturity_score_summary_get"

        };
		
    }
    
    return new RestModule();
});