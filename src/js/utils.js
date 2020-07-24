/* Utils JS
 * ---------------------------------------------------------------------------------------
 * Created By   : Priyadarsini T B
 * Creation Date: 26-Nov-2019 
 * Description  : Utils Js to maintain all utility functions for the application
 * Change History:
 * Date         Version#  Name                          Remarks
  -----------  --------  --------------------------    -----------------------------------
 * 26-Nov-2019   1.0      Priyadarsini T B              Initial Draft
 *
 * ---------------------------------------------------------------------------------------
 */
/*Set in session*/
function setInSession(variable,value){  
  sessionStorage.setItem(variable,JSON.stringify(value));  
};
/*get from session*/
function getFromSession(variable){
    if(sessionStorage.getItem(variable) && sessionStorage.getItem(variable) != "undefined"){
        return JSON.parse(sessionStorage.getItem(variable));
    }
    else{
        return null;
    }
};
function setInLocalStorage(variable,value){
    localStorage.setItem(variable,JSON.stringify(value)); 
}
function getFromLocalStorage(variable){
   if(localStorage.getItem(variable)){
        return JSON.parse(localStorage.getItem(variable));
    }
    else{
        return null;
    }
}
//To get the current logged in user
function getCurrentUser(){
    return localStorage.getItem("portalUsername");
}

//To get the current User's currency
function getCurrentUserCurrency(){
    var currency = getFromSession("selectedCurrency");
    if(currency)
        return currency;
    else
        return "USD";
}

//To set the current User's currency
function setCurrentUserCurrency(value){
    setInSession("selectedCurrency",value);
}

//To get the current User's currency rate
function getCurrentUserCurrencyRate(){
    var currencyRate = getFromSession("selectedCurrRate");
    if(currencyRate)
        return currencyRate;
    else
        return "1.0";
}

//To get the current User's currency
function setCurrentUserCurrencyRate(value){
    setInSession("selectedCurrRate",value);
}


/**Check if a JSON object is empty or not */
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


/* Clear Session Params */
function clearSessionParams(param) {
    
    if (param === "ALL" || param === null)
    {
        console.log("Clearing all parameters from session storage");
        sessionStorage.clear();
    } else
    {
        let keys = Object.keys(sessionStorage);
        for(let key of keys) {
            //alert(`${key}: ${sessionStorage.getItem(key)}`);
            if (key === param)
            {
                sessionStorage.removeItem(param);
                console.log("Clearing "+param+" from session storage");
            }
        }
        
    }
}

function getCurrencyConverter(){
    /*Converter/Validators start*/
    var convFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER);
    self.currencyConverter;
    //,"minimumFractionDigits": "2" - need to check if required
    var currencyOptions;
    if(getCurrentUserCurrency()== ('USD' || 'SGD')){
        currencyOptions = {"style": "currency", "currency": "", 
                               "currencyDisplay": "code", "pattern": "¤ ##,##0.00"};
    }
    else if(getCurrentUserCurrency()== 'EUR' ){
        currencyOptions = {"style": "currency", "currency": "", 
                               "currencyDisplay": "code", "pattern": "¤#,##0.00;(¤#,##0.00)"};// Sample
     }else{
        currencyOptions = {"style": "currency", "currency": "", 
                               "currencyDisplay": "code", "pattern": "¤ ##,##0.00"};//// Sample
    }
    return currencyConverter = convFactory.createConverter(currencyOptions);
}

/*Basic Auth Token Generator for logged in user*/
function getLoggedInBtoa(){
    return getFromSession("loggedInBtoa");
  }
 
function setLoggedInBtoa(token){
   setInSession("loggedInBtoa",token);
}

/*Get Pain Points selected ids from session*/
function getPainPointsSltdIds(indCode,domCode){
    var selected_pps =  getFromSession("selectedPainPoints");
    //console.log(indCode, domCode, selected_pps)
    if(selected_pps===null) selected_pps=undefined;
    var selectedPPItems = [];
    if(selected_pps!=undefined && selected_pps[indCode]!=undefined)
    {
        if(selected_pps[indCode][domCode]!=undefined)
        {
            let ppArr = selected_pps[indCode][domCode];
            if(ppArr["selected_pp"]!=undefined)
            {
                selectedPPItems = ppArr["selected_pp"];
            }
        }
    }
    return selectedPPItems;
}
/*Set Pain Points selected ids into session*/
function setPainPointsSltdIds(indCode,domCode,value){

    /* let prevData = getFromSession("selectedPainPoints");
    Object.keys(value).forEach(function(val, key){
         prevData[val] = value[val];
    })
    sessionStorage.setItem('selectedIds', JSON.stringify(prevData)); */

    //console.log(indCode, domCode, value)
    var selected_pps = getFromSession("selectedPainPoints");
    //console.log(selected_pps);
    if(selected_pps===null) selected_pps=undefined;
    var jsonData = {};
    var jsonData1 = {};
    if(selected_pps!=undefined && selected_pps[indCode]!=undefined)
    {
        //Updating session value if exists
        var jsonData = selected_pps[indCode];
        if(jsonData[domCode]!=undefined)
        {
            var ppArr = selected_pps[indCode][domCode];
            //console.log(ppArr);
            if(ppArr["selected_pp"]!=undefined)
            {
                ppArr["selected_pp"] = value;
            }
            else {
                ppArr = {
                    "selected_pp": value
                }
            }
        }
        else {
            jsonData[domCode] = {
                "selected_pp": value
            }
        }
        setInSession("selectedPainPoints",selected_pps);
    }
    else {
        //Adding into session first time
        jsonData1[domCode] = {
            "selected_pp": value
        }
        jsonData[indCode] = jsonData1;
        //console.log(jsonData);
        setInSession("selectedPainPoints",jsonData);
    }
}

var cbmContext = {
    CBM :
    {
      industry : ""
      ,industryCode : ""
      ,domain : ""
      ,domainCode : ""
      ,desc : ""
      ,bwlUrl : ""
    }
  }

