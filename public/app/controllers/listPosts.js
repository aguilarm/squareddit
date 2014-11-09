'use strict';

squareddit.controller('listPosts', ['$scope', 'posts',
    function ($scope, posts) {
        $scope.posts = posts.posts;
        $scope.updatePosts = function () {
            console.log($scope.subreddit);
            posts.hot = posts.getHot($scope.subreddit);
            console.log(posts.hot);
        };
}]);