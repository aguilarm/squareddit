squareddit.factory('redditUser', ['$http', function usersFactory($http) {
    var userServ = {};
    
    userServ.vote = function vote(postId, voteDir) {
        return $http.post('/user/vote',
            {
                id: postId,
                dir: voteDir
            }).success(function (data) {
                console.log('vote successful');
                return;
            }).error(function() {
                console.log('vote for ' + postId + ' unsuccessful!');
                return;
            });
    };
    
    return userServ;
}]);