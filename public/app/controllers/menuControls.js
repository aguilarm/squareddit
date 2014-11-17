'use strict';

squareddit.controller('menuControls', ['$scope', 'posts',
    function ($scope, posts) {
        $scope.posts = posts;
        
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
}]);