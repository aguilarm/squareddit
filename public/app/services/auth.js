squareddit.factory('auth', ['$http', function authFactory($http) {
    var authServ = {};
    
    authServ.loggedIn = false;
    authServ.user = {};
    authServ.showLogin = false;
    
    authServ.getUser = function getUser() {
            return $http.get('/auth/account').
                success(function (data) {
                    if (data.name) {
                        authServ.loggedIn = true;
                        authServ.user = data._json;
                    } else {
                        authServ.loggedIn = false;
                    }
                }).
                error(function (data, status) {
                    authServ.loggedIn = false;
                    console.log('log in check failed');
                });
        };
        
    return authServ;
    
}]);