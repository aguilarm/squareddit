'use strict';

squareddit.controller('listPosts', ['$scope', '$document', 'posts',
    function ($scope, $document, posts) {
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
            if (scrollPosBottom >= threshold && threshold > winH*0.8)
                posts.getPosts(posts.currentSub, 'hot', true);
        }, 500);
        
        $document.on('keydown', function(e) {
            console.log(e);
            if (e.keyCode === 40) {
                e.preventDefault();
                window.scrollBy(0,winH);
            }
            if (e.keyCode === 38) {
                e.preventDefault();
                window.scrollBy(0,-winH);
            }
            if (e.keyCode === 37) {
                e.preventDefault();
                window.scrollBy(0, -winH);
            }
            if (e.keyCode === 39) {
                e.preventDefault();
                window.scrollBy(0, winH);
            }
        });
        
        
            
            
}]);