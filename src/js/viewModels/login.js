define(['ojs/ojcore', 'knockout', 'jquery', 'appController','restModule','ojs/ojknockout','ojs/ojlabel','ojs/ojinputtext', 'ojs/ojcheckboxset', 'ojs/ojvalidationgroup', 'ojs/ojformlayout', 'ojs/ojasyncvalidator-regexp', 'ojs/ojvalidation-base'],
 function(oj, ko, $, app, restModule, AsyncRegExpValidator) {
  
    function LoginViewModel() {

        var self = this;
        /* function param(name) {
            return (location.search.split(name + '=')[1] || '').split('&')[0];
        } */
        self.username = ko.observable("");
        self.password = ko.observable("");

        self.loginMessages = ko.observableArray([]);
        self.rememberMe = ko.observable(false);

        self.connected = function(){
            /* if(backend.isAuthorized()){
                app.router.go('home');
            }
            else{
                if(localStorage.getItem("cogentRememberMe") == "true"){
                    self.username(localStorage.getItem("cogentUsername"));
                    self.rememberMe(true);
                }else{
                    self.username("");
                    self.rememberMe(false);
                }
                self.password("");
                self.loginMessages([]);
            } */
            loadPrompts();

            var serviceUserAccount = "portalusersvc";
            var serviceUserPassword = "Welcome1";//
            var serviceAccountCredentialToken = "Basic "+btoa(serviceUserAccount+":"+serviceUserPassword);
            console.log("[Login]: credentialToken = "+serviceAccountCredentialToken);
            setLoggedInBtoa(serviceAccountCredentialToken);    
            restModule.updateToken(serviceAccountCredentialToken);        
            //setLoggedInBtoa(serviceAccountCredentialToken);
        };

        //---------validation handler
        self.groupValid = ko.observable();

        /* self.userNameCheck = {
            validate: function (value) {
                if (!value) {
                    return false;
                }
                return true;
            }
        }; */

        self.emailPatternValidator = ko.pureComputed(function () {
            return [{
                type: 'regExp',
                options: { 
                  //pattern: "[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*",
                  pattern: "[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$",
                  messageDetail: "Not a valid email format"}}];
          });
      
        self.doLogin = function doLogin(event){

            //Set User Login to display on Header (index.html refers appController's userLogin observable)
            app.userLogin(self.username());

            //validation...
            document.getElementById("username").validate();
            document.getElementById("password").validate();
            
            var tracker = document.getElementById("tracker");
            if (tracker.valid === "valid")
            {

                //Write validation code
                /* var serviceUserAccount = "portalusersvc";
                var serviceUserPassword = "Welcome1";
                var serviceAccountCredentialToken = "Basic "+btoa(serviceUserAccount+":"+serviceUserPassword);
                console.log("[Login]: credentialToken = "+serviceAccountCredentialToken);
                setLoggedInBtoa(serviceAccountCredentialToken); */
                self.validateUserLogin();
                
                //$("body").css("cursor", "wait");
                //do server login here
                /* var string = self.username() + ':' + self.password();
                var encodedString = 'Basic ' + btoa(string);
                    
                var promise = $.ajax({
                    type: "POST",
                    url: app.serviceInitialURL + '/v1/auth/login',
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        "Content-Type": "text/plain",
                            "Authorization": encodedString
                    },
                    crossDomain: true,
                    dataType: "json"});
                
                promise.then(function(response){
                    var origurl = param('origurl');
                    if(origurl){
                        window.location.href = origurl;
                    }
                    else{
                        oj.Router.rootInstance.go('dataGrid');
                    }

                    $("body").css("cursor", "default");
                }, function(response){
                    //write logic here to show error message to end user.
                }) ;  */  
            }
        }

        self.validateUserLogin = function () {

            console.log("[Login]::validateUserLogin begins");
            console.log("[Login]:: REST URI = "+restModule.API_URL.validateUserLogin);

            var loginService = {url: restModule.API_URL.validateUserLogin, method: "GET", data: {}};

            /*URL Parameters*/
            loginService.parameters = {};
            /*Header Parameters*/
            //loginService.headers = { username_var: 'test@in.ibm.com', password_var: 'V2VsY29tZTE', Authorization: getLoggedInBtoa() };
            loginService.headers = { username_var: self.username(), password_var: btoa(self.password()), Authorization: getLoggedInBtoa() };
            
            restModule.callRestAPI(loginService, function (response) {
            console.log("[Login]:: Validate Login Response Received");
            if (response.items && response.items != null) {
                console.log(response.items[0].auth_status);
                if (response.items[0].auth_status === "Authentication Success")
                {
                    console.log("[Login]:: Login Successful. Redirecting to Search screen");
                    oj.Router.rootInstance.go('searchPortal');
                }else{
                    console.log("[Login]:: Login Incorrect. Prompt to re-enter credentials");
                    var invalidCredentialPrompt = "Please enter valid credentials to login to the portal.";
                    console.log(invalidCredentialPrompt);
                    app.showMessages(null, 'error', invalidCredentialPrompt);    
                }

            } else {
                console.log(response);
            }
            }, function (failResponse) {
                var loginServiceFailPrompt = "Validate Login Service failure";
                console.log(loginServiceFailPrompt);
                console.log(failResponse);
                
                app.showMessages(null, 'error', loginServiceFailPrompt);
            });
        };

        self.loginUser = ko.observable({"username": "", "password": "", "rememberMe": false});
        self.username = ko.observable("");
        self.password = ko.observable("");  
        
        /*Prompts*/
        self.userNamePrompt = ko.observable();
        self.pwdPrompt = ko.observable();     
        self.rmbrUsrNamePrompt = ko.observable();
        this.rememberMe = ko.observableArray();
                
        function loadPrompts() {
            self.userNamePrompt("Username");
            self.pwdPrompt("Password");
            self.rmbrUsrNamePrompt("Remember Me");
        }

        // Header Config
        //self.headerConfig = {'viewName': 'header', 'viewModelFactory': app.getHeaderModel()};

    }

    return new LoginViewModel();
  }
);