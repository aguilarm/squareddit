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
            //set initial value, add more as needed.
            angular.copy(data, current.hot);
            var updatedData = data,
                currentIndex = 0;
            console.log(updatedData);
            for (var i = 0; i < data.length; i++) {
                var post = data[i].data,
                    hasExt = (/\.(gif|jpg|jpeg|tiff|png)$/i).test(post.url);
                    console.log(updatedData[i].data.url);
                //check for imgur links without extention, if one is found, return the promise
                if (post.domain.search("imgur.com") != -1 && hasExt === false) {
                    //imgur will serve the correct image no matter what extension you put in the address...
                    post.url += '.jpg';
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