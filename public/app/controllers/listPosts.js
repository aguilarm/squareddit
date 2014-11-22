'use strict';

squareddit.controller('listPosts', ['$scope', '$document', 'posts', 'auth',
    function ($scope, $document, posts, auth) {
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
        
        $scope.vote = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            if (auth.loggedIn === 0) {
                alert('You must be logged in to do that!');
                return;
            }
        };
        
        
        $document.on('keydown', function(e) {
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