'use strict';

squareddit.factory('posts', ['$http', function postsFactory($http) {
    var o = {
        posts: []
    };
    o.getHot = function (subreddit) {
        console.log('getting hot posts');
        return $http({
                method: 'JSONP',
                url: 'http://www.reddit.com/r/' + subreddit + '/hot.json',
                success: function (data) {
                    angular.copy(data, o.posts);
                }
        });
    };
    return o;
}]);