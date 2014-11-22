'use strict';

squareddit.factory('posts', ['$http', function postsFactory($http) {
    var current = [],
        currentSort = 'hot',
        cachedSubreddit,
        loading = false,
        after,
        error = '',
        processImgur = function (data) {
            return;
        },
        processImages = function (v, i , arr) {
            var post = v.data,
                hasExt = (/\.(gif|gifv|jpg|jpeg|tiff|png)$/i).test(post.url);
                
            if(post.stickied)
                return;
                
            if(post.url.substring(0,5) === "http:") {
                var https = post.url.replace("http:", "https:");
                post.url = https;
            }
                
            //imgur will grab the right image regardless of format
            if(post.domain.search("imgur") >= 0 && hasExt === false)
                post.url += '.jpg';
                
            //not imgur and no extension?  not displayed.
            if(post.domain.search("imgur") === -1 && hasExt === false)
                return;
            
            return v;
        };
    return {
        getPosts: function (subreddit, sortMethod, pageUp) {
            if (loading) return;
            loading = true;
            
            if (!sortMethod) 
                sortMethod = 'hot';
            if (!cachedSubreddit)
                cachedSubreddit = current.sub;
            console.log(cachedSubreddit);
            currentSort = sortMethod;
            console.log(subreddit);
            console.log(current.sub);
            if (!subreddit)
                subreddit = current.sub;
            if (!current.sub)
                current.sub = subreddit;
            
            if(cachedSubreddit) {
                if (cachedSubreddit.toLowerCase() != current.sub.toLowerCase()) {
                    var blank=[];
                    angular.copy(blank, current);
                }
            }
            
            cachedSubreddit = subreddit;
            
            var url = 'https://www.reddit.com/r/' + subreddit + '/' + sortMethod + '.json';
            
            if (after && pageUp)
                url += after;
                
            return $http.get(url).
                success(function (response) {
                    var imgs = response.data.children.filter(processImages);
                    
                    for (var i = 0; i < imgs.length; i++) {
                        current.push(imgs[i].data);
                    }
                    
                    if (current.length === 0) {
                        error = "No images or bad subreddit!";
                        console.log('Error loading reddit page!');
                        loading = false;
                        return error;
                    }
                    
                    after = '?after=' + imgs[imgs.length-1].data.name;
                    loading = false;
                }).
                error(function (data, status) {
                    error = "Request failed - error communicating with reddit.";
                    loading = false;
                    return error;
                });
        },
        current: current,
        currentSort: currentSort,
        error: error,
    };
}]);