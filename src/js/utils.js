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
    if(sessionStorage.getItem(variable)){
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
    console.log(currencyOptions);
    return currencyConverter = convFactory.createConverter(currencyOptions);
}

/*Basic Auth Token Generator for logged in user*/
function getLoggedInBtoa(){
    return getFromSession("loggedInBtoa");
  }
 
function setLoggedInBtoa(token){
   setInSession("loggedInBtoa",token);
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

