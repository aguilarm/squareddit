'use strict';

squareddit.factory('posts', ['$http', function postsFactory($http) {
    var o = {
        posts: []
    };
    o.getHot = function (subreddit) {
        return $http.get('http://www.reddit.com/r/' + subreddit + '/hot.json');
    };
    o.processImages = function (data) {
        //todo this should add img tags/change for flickr and imgur links with no extension
        return data;
    };
    return o;
}]);