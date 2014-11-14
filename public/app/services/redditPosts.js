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
                    var imageId = post.url.match(/[^\/]*$/)[0];
                    $http.get('https://api.imgur.com/3/image/' + imageId + '.json', {
                        headers: {'Authorization': 'Client-ID ' + ids.imgurID}
                    }).success(function (response) {
                        //add this link to updatedData and then overwrite the old current.hot data
                        //pretty sure there is a better solution here, but:
                        post.url = response.data.link;
                        console.log(updatedData[i]);
                        updatedData[i].data.url = post.url;
                        angular.copy(updatedData, current.hot);
                    });
                }
                    
            }
            return data;
        };
    return {
        getHot: function (subreddit) {
            return $http.get('http://www.reddit.com/r/' + subreddit + '/hot.json').
                success(function (response) {
                    processImages(response.data.children);
                });
        },
        current: current,
        currentSub: currentSub,
        hot: current.hot
    };
}]);