'use strict';

squareddit.factory('posts', ['$http', function postsFactory($http) {
    var o = {
        posts: []
    };
    o.getHot = function (subreddit) {
        return $http.get('http://www.reddit.com/r/funny/hot.json').
                then(function (res) {
                    return res.data;
                });
        };
    return o;
}]);