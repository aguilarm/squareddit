'use strict';

squareddit.factory('posts', ['$http', 'ids', function postsFactory($http, ids) {
    var current = [],
        currentSub = 'cityporn',
        loading = false,
        after,
        processImgur = function (data) {
            return;
        },
        processImages = function (data) {
            for (var i = 0; i < data.length; i++) {
                var post = data[i].data,
                    hasExt = (/\.(gif|gifv|jpg|jpeg|tiff|png)$/i).test(post.url);
                //if it's a sticky post, don't display it.
                if (post.stickied) {
                    data.splice(i,1);
                    i = i - 1;
                    console.log('sticky');
                    continue;
                }
                if (post.domain.search("imgur") >= 0 && hasExt === false) {
                    //imgur will serve the correct image no matter what extension you put in the address...
                    post.url += '.jpg';
                    console.log('imgur.jpg');
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
        getPosts: function (subreddit, sortMethod, pageUp) {
            if (loading) return;
            loading = true;
            
            if (!sortMethod) 
                sortMethod = 'hot';
            
            if (subreddit != currentSub) {
                var blank=[];
                angular.copy(blank, current);
            }
            
            currentSub = subreddit;
            
            var url = 'http://www.reddit.com/r/' + subreddit + '/' + sortMethod + '.json';
            
            if (after && pageUp)
                url += after;
                
            return $http.get(url).
                success(function (response) {
                    var imgs = processImages(response.data.children);
                    
                    for (var i = 0; i < imgs.length; i++) {
                            current.push(imgs[i].data);
                    }
                    
                    console.log(current);
                    
                    after = '?after=' + imgs[imgs.length-1].data.name;
                    loading = false;
                });
        },
        current: current,
        currentSub: currentSub,
    };
}]);