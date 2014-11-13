'use strict';

squareddit.factory('posts', ['$http', function postsFactory($http) {
    var currentHot = {},
        currentSub = 'cityporn',
        processImages = function (data) {
            //todo this should add img tags/change for flickr and imgur links with no extension
            return data;
        };
    return {
        getHot: function (subreddit) {
            return $http.get('http://www.reddit.com/r/' + subreddit + '/hot.json').
                success(function (response) {
                    var data = response.data.children;
                    currentHot = data;
                });
        },
        currentHot: currentHot,
        currentSub: currentSub
    };
}]);