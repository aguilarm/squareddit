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
            
            var url = 'https://www.reddit.com/api/login',
                creds = { 
                    'user': user,
                    'passwd': pass,
                    'api_type': 'json',
                    'rem': 0,
                },
                req = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'user-agent': 'Squareddit Early by Thyrst'
                    },
                    data: creds
                };
                
            
            
            if (rem)
                req.data.creds.rem = 1;
            
            return $http(req).
                success(function (data) {
                    console.log(data);
                }).error(function () {
                    console.log('Unable to login!');
                });
        },
        getUser: function getUser() {
            return $http.get('/login').
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