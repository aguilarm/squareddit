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
                    hasExt = (/\.(gif|jpg|jpeg|tiff|png)$/i).test(post.url);
                //if it's a sticky post, don't display it.
                if (post.stickied)
                    data.splice(i, 1);
                //check for imgur links without extention, if one is found, return the promise
                if (post.domain.search("imgur.com") != -1 && hasExt === false) {
                    //imgur will serve the correct image no matter what extension you put in the address...
                    post.url += '.jpg';
                }
                //flickr requires some work to grab the author and photo from indirect links,
                //and 500px appears to sell the photos, so linking them is questionable
                //for now, just removing them.
                if(post.domain.search("flickr") != -1) {
                    console.log(post.domain);
                    console.log(post.url);
                    console.log(post.title);
                    data.splice(i, 1);
                    console.log(i);
                }
                if(post.domain.search("500px.com") != -1)
                    data.splice(i, 1);
            console.log(i);
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