squareddit.factory('redditUser', ['$http', function usersFactory($http) {
    var userServ = {};
    
    userServ.vote = function vote(id, dir) {
        return $http.post('/user/vote',
            {
                id: id,
                dir: dir
            }).success(function (data) {
                console.log('vote successful');
            }).error(function() {
                console.log('vote for ' + id + ' unsuccessful!');
            });
    };
    
    return userServ;
}]);