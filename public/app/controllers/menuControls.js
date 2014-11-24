'use strict';

squareddit.controller('menuControls', ['$scope', 'posts', 'auth',
    function ($scope, posts, auth) {
        $scope.posts = posts;
        $scope.auth = auth;
        
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
            auth.logIn(user, pass, rem);
        }
}]);