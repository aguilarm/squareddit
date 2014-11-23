squareddit.factory('auth', ['$http', function authFactory($http) {
    var auth = {},
        user,
        loggedIn;
    
    return {
        getUser: function getUser() {
            return $http.get("https://www.reddit.com/api/me.json").
                success(function (response) {
                    loggedIn = true;
                    user = response.data;
                    console.log('user');
                }).
                error(function (data, status) {
                    loggedIn = false;
                    console.log("log in failed");
                }); 
        },
        user: user
    };
}]);