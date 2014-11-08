'use strict';

squareddit.controller('listPosts', ['$scope', 'posts',
    function ($scope, posts) {
        $scope.posts = posts.posts;
        $scope.checkPosts = function (subreddit) {
            posts.getHot(subreddit);
            console.log(posts.posts);
        };
}]);