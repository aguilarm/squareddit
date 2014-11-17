'use strict';

squareddit.controller('menuControls', ['$scope', 'posts',
    function ($scope, posts) {
        $scope.posts = posts;
        $scope.updatePosts = function () {
            posts.getPosts(posts.current.sub, 'hot');
        };
}]);