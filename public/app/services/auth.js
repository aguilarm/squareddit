squareddit.factory('auth', ['$http', function authFactory($http) {
    var user= [],
        loggedIn = false,
        showLogin;
    
    return {
        logIn: function logIn(user, pass, rem) {
            if (!user || !pass) {
                console.log('Username and password required!');
                return;
            }
            
            var url = 'https://www.reddit.com/api/login?api_type=\'json\'?user='+user+'?passwd='+pass;
            
            if (rem)
                url += '?rem=\'true\'';
            
            return $http.post(url).
                success(function (data) {
                    console.log(data);
                });
        },
        getUser: function getUser() {
            return $http.get('https://www.reddit.com/api/me.json').
                success(function (data) {
                    if (data.length) {
                        loggedIn = true;
                        user = data.data;
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