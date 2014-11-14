'use strict';

squareddit.factory('posts', ['$http', 'ids', function postsFactory($http, ids) {
    var current = {
            hot: [],
        },
        currentSub = 'test',
        processImgur = function (data) {
            return;
        },
        processImages = function (data) {
            console.log(data.length);
            for (var i = 0; i < data.length; i++) {
                var post = data[i].data,
                    lastChar = post.url.substr(-1),
                    hasExt = (/\.(gif|jpg|jpeg|tiff|png)$/i).test(post.url);
                //if it's a sticky post, don't display it.
                if (post.stickied) {
                    data.splice(i,1)
                    i = i - 1;
                    continue;
                }
                if (post.domain.search("imgur") >= 0 && hasExt === false) {
                    //imgur will serve the correct image no matter what extension you put in the address...
                    post.url += '.jpg';
                    continue;
                } 
                if (hasExt === false) {
                    data.splice(i,1);
                    i = i - 1;
                }
            }
            return data;
        };
    return {
        getHot: function (subreddit) {
            return $http.get('http://www.reddit.com/r/' + subreddit + '/hot.json').
                success(function (response) {
                    var imgs = processImages(response.data.children);
                    angular.copy(imgs, current.hot);
                });
        },
        current: current,
        currentSub: currentSub,
        hot: current.hot
    };
}]);