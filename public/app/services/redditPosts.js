'use strict';

squareddit.factory('posts', ['$http', 'ids', function postsFactory($http, ids) {
    var current = [],
        currentSub = 'cityporn',
        loading = false,
        after,
        processImgur = function (data) {
            return;
        },
        processImages = function (v, i , arr) {
            var post = v.data,
                hasExt = (/\.(gif|gifv|jpg|jpeg|tiff|png)$/i).test(post.url);
                
            if(post.stickied)
                return;
                
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
                    var imgs = response.data.children.filter(processImages);
                    
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