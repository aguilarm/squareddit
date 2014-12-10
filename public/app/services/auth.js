squareddit.factory('auth', ['$http', function authFactory($http) {
    var user= [],
        loggedIn,
        showLogin;
    
    return {
        getUser: function getUser() {
            return $http.get('/auth/account').
                success(function (data) {
                    if (data.name) {
                        loggedIn = true;
                        user = data._json;
                    } else {
                        loggedIn = false;
                    }
                    
                    console.log(data);
                    console.log(loggedIn);
                    
                }).
                error(function (data, status) {
                    loggedIn = false;
                    console.log('log in check failed');
                }); 
        },
        loggedIn: loggedIn,
        showLogin: showLogin,
        user: user,
    };
}]);