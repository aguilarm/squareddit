'use strict';

squareddit.controller('listPosts', ['$scope', 'posts',
    function ($scope, posts) {
        $scope.posts = posts.posts;
        $scope.checkPosts = function () {
            console.log($scope.subreddit);
            posts.getHot($scope.subreddit);
            console.log(posts.posts);
        };
}]);