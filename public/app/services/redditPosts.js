'use strict';

squareddit.factory('posts', ['$http', function postsFactory($http) {
    var o = {
        posts: []
    };
    o.getHot = function (subreddit) {
        return $http.get('http://www.reddit.com/r/' + subreddit + '/hot.json');
    };
    return o;
}]);