'use strict';

squareddit.factory('posts', ['$http', 'ids', function postsFactory($http, ids) {
    var current = {
            hot: [],
        },
        currentSub = 'test',
        processImages = function (data) {
            for (var i = 0; i < data.length; i++) {
                var post = data[i].data,
                    hasExt = (/\.(gif|jpg|jpeg|tiff|png)$/i).test(post.url);
                console.log(post.domain);
                //check for imgur links without extention, and for now just add .jpg
                if (post.domain.search("imgur.com") != -1 && hasExt === false) {
                    var imageId = post.url.match(/[^\/]*$/)[0];
                    $http.get('https://api.imgur.com/3/image/' + imageId + '.json', {
                        headers: {'Authorization': 'Client-ID ' + ids.imgurID}
                        }).success(function (response) {
                            post.url = response.data.link;
                            console.log(post.url);
                        });
                }
                    
            }
            return data;
        };
    return {
        getHot: function (subreddit) {
            return $http.get('http://www.reddit.com/r/' + subreddit + '/hot.json').
                success(function (response) {
                    var thesePosts = processImages(response.data.children);
                    angular.copy(thesePosts, current.hot);
                });
        },
        current: current,
        currentSub: currentSub
    };
}]);