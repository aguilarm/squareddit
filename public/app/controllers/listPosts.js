'use strict';

squareddit.controller('listPosts', ['$scope', 'posts',
    function ($scope, posts) {
        $scope.posts = posts.posts;
        $scope.subreddit = 'cityporn';
        $scope.updatePosts = function () {
            if (!$scope.subreddit)
                return 'Error';
            $scope.hot = '';
            posts.getHot($scope.subreddit).
                success(function (response) {
                    var data = posts.processImages(response.data.children);
                    $scope.hot = data;
                }).
                error(function () {
                    return 'Error';
                });
        };
        $scope.showPosts = function () {
            console.log($scope.hot);
        };
}]);