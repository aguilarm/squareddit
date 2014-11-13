'use strict';

squareddit.factory('posts', ['$http', function postsFactory($http) {
    var current = {
            hot: [],
        },
        currentSub = 'test',
        processImages = function (data) {
            //todo this should add img tags/change for flickr and imgur links with no extension
            return data;
        };
    return {
        getHot: function (subreddit) {
            console.log('g');
            return $http.get('http://www.reddit.com/r/' + subreddit + '/hot.json').
                success(function (response) {
                    console.log(current.hot);
                    var thesePosts = response.data.children;
                    angular.copy(thesePosts, current.hot);
                    console.log(current.hot);
                });
        },
        current: current,
        currentSub: currentSub
    };
}]);