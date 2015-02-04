squareddit.controller('statusbarController', ['$scope', 'redditPosts', 'redditAuth',
    function ($scope, redditPosts, redditAuth) {
        $scope.posts = redditPosts;
        $scope.auth = redditAuth;
        
        $scope.sortMethods = [
            'hot',
            'new',
            'rising',
            'controversial',
            'top',
            'gilded'
        ];
        
        $scope.updatePosts = function () {
            posts.getPosts(posts.current.sub, 'hot');
        };
        
        $scope.logIn = function menuLogIn(user, pass, rem) {
            if(!user || !pass) {
                alert('Username and password required!');
                return;
            }
            
            redditAuth.showLogin = false;
            redditAuth.logIn(user, pass, rem);
        }
}]);