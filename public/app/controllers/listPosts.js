'use strict';

squareddit.controller('listPosts', ['$scope', 'posts',
    function ($scope, posts) {
        $scope.posts = posts.posts;
        $scope.subreddit = 'cityporn';
        $scope.updatePosts = function () {
            if (!$scope.subreddit)
                return 'Error';
            $scope.hot = '';
            console.log($scope.subreddit);
            posts.getHot($scope.subreddit).
                success(function (response) {
                    $scope.hot = response.data.children;
                }).
                error(function () {
                    return 'Error';
                });
        };
        $scope.showPosts = function () {
            console.log($scope.hot);
        };
}]);