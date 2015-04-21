squareddit.controller('homeController', [
    '$scope', '$document', 'redditPosts', 'redditAuth', 'redditUser',
    function ($scope, $document, redditPosts, redditAuth, redditUser) {
        var postsLength = document.getElementById('sr-posts').offsetHeight,
            winH = window.innerHeight,
            scrollPosBottom,
            threshold;
            
        $scope.posts = redditPosts;
        $scope.auth = redditAuth;
        $scope.user = redditUser;
        
        setInterval(function() {
            scrollPosBottom = window.pageYOffset + winH;
            postsLength = document.getElementById('sr-posts').offsetHeight;
            threshold = postsLength - winH;
            if (scrollPosBottom >= threshold && threshold > winH*0.8)
                redditPosts.getPosts(redditPosts.currentSub, 'hot', true);
        }, 500);
        
        
        
        $scope.vote = function ($event, postID, dir) {
            var voteButton = $event.target.parentNode;
            
            $event.preventDefault();
            $event.stopPropagation();
            
            if (redditAuth.loggedIn === false) {
                alert('You must be logged in to do that!');
                return;
            }
            
            //send a 0 (reset) dir if an active element is clicked
            if (dir !== 0 && voteButton.className.indexOf('sr-post-voted') >= 0) {
                console.log('reset');
                redditUser.vote(postID, 0);
                voteButton.className = 
                    voteButton.className.replace(' sr-post-voted', '');
                return;
            }
            
            console.log('VOTING');
            redditUser.vote(postID, dir);
            
            voteButton.className += ' sr-post-voted';
            
        };
            
}]);