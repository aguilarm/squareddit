squareddit.factory('auth', ['$http', function authFactory($http) {
    var auth = {};
    auth.loggedIn = 0;
    return auth;
}]);