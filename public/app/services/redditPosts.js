'use strict';

squareddit.factory('posts', ['$http', function postsFactory($http) {
    
    //declare posts and a few scoped helper vars
    var posts = {},
        loading = false,
        after;
    
    posts.current = [];
    //init with 'hot' as default, will change soon
    posts.currentSort = 'hot';
    posts.loading = false;
    posts.after = '';
    posts.processImages = function processImages(v, i, arr) {
        var post = v.data,
            hasExt = (/\.(gif|gifv|jpg|jpeg|tiff|png)$/i).test(post.url);
                
        if(post.stickied)
            return;
                
        //imgur will grab the right image regardless of format
        //most of the time if an imgur link has no ext, adding one is safe
        //and makes it load properly.  need a proper fix for albums
        if(post.domain.search("imgur") >= 0 && hasExt === false)
            post.url += '.jpg';
                
        //not imgur and no extension?  not displayed.
        if(post.domain.search("imgur") === -1 && hasExt === false)
            return;
            
        return v;
    };
    
    posts.getPosts = function (subreddit, sortMethod, pageUp) {
        if (loading) return;
        loading = true;
            
        if (!sortMethod) 
            sortMethod = 'hot';
        if (!posts.cachedSubreddit)
            posts.cachedSubreddit = posts.current.sub;
            
        posts.currentSort = sortMethod;
            
        if (!subreddit)
            subreddit = posts.current.sub;
        if (!posts.current.sub)
            posts.current.sub = subreddit;
        
        if(posts.cachedSubreddit) {
            if (posts.cachedSubreddit.toLowerCase() != posts.current.sub.toLowerCase()) {
                var blank=[];
                posts.angular.copy(blank, posts.current);
            }
        }
            
        posts.cachedSubreddit = subreddit;
        
        var url = 'https://www.reddit.com/r/' + subreddit + '/' + sortMethod + '.json';
            
        if (after && pageUp)
            url += after;
                
        return $http.get(url).
            success(function (response) {
                var imgs = response.data.children.filter(posts.processImages);
                    
                for (var i = 0; i < imgs.length; i++) {
                    posts.current.push(imgs[i].data);
                }
                    
                if (posts.current.length === 0) {
                    console.log('Error loading reddit page!');
                    loading = false;
                    return;
                }
                    
                after = '?after=' + imgs[imgs.length-1].data.name;
                loading = false;
            }).
            error(function (data, status) {
                loading = false;
                return ;
            });
    };
    
    return posts;
    
}]);