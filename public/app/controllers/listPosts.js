'use strict';

squareddit.controller('listPosts', ['$scope', 'posts',
    function ($scope, posts) {
        var postsLength = document.getElementById('sr-posts').offsetHeight,
            winH = window.innerHeight,
            halfWinH = winH/2,
            scrollPosBottom,
            threshold;
        $scope.posts = posts;
        setInterval(function() {
            scrollPosBottom = window.pageYOffset + winH;
            postsLength = document.getElementById('sr-posts').offsetHeight;
            threshold = postsLength - winH;
            if (scrollPosBottom >= threshold)
                posts.getPosts(posts.currentSub, 'hot', true);
                
        }, 300);
        
        
        
        
            
            
}]);