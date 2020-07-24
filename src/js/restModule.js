/* @author : Priyadarsini T B
   @Created : 03-Dec-2019
 */
define(['ojs/ojcore', 'knockout', 'jquery'], function (oj, ko, $) {
    
    function RestModule() {
        
        var self = this;
        
        var token = getLoggedInBtoa(); 
        self.token = ko.observable(token);
        self.updateToken = function(token){
            self.token(token);
        }

        self.callRestAPI = function (service, sucessCallBack, failureCallBack) {
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
            /* Setting auth token can be enabled after basic auth is setup*/
            if(service.url.includes(self.ORDS_REST_BASE_URI))
            {   
                if(self.token())
                {
                    if (service.headers){
                     service.headers['Authorization'] = self.token();
                    } else{
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

        let host = window.location.href;        
        /*self.ORDS_REST_BASE_URI = "http://129.150.172.40:8080/ords";*/
        self.ORDS_REST_BASE_URI = "http://129.213.116.85:8080/ords/"+ ( (host.includes("Dev") || host.includes("localhost") || host.includes("FD")) ? "portal_workspace_dev" : "portal_workspace") ;
        
        self.API_URL = {
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
            ,"getAssmntAvgOfDomains": self.ORDS_REST_BASE_URI+"/xxibm_portal_questions/xxibm_portal_multidomain_maturity_score_get"
            ,"deleteAssesmentSmry"  : self.ORDS_REST_BASE_URI+"/xxibm_portal_questions/xxibm_portal_maturity_score_summary_delete"

        };
		
    }
    
    return new RestModule();
});