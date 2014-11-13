'use strict';

squareddit.controller('listPosts', ['$scope', 'posts',
    function ($scope, posts) {
        $scope.posts = posts.posts;
        $scope.hot = posts.curHot;
        $scope.subreddit = 'cityporn';
        $scope.updatePosts = function () {
            if (!$scope.subreddit)
                return 'Error';
            $scope.hot = '';
            posts.getHot($scope.subreddit).
                success(function (response) {
                    var data = posts.processImages(response.data.children);
                    posts.curHot = data;
                }).
                error(function () {
                    return 'Error';
                });
        };
        $scope.showPosts = function () {
            console.log($scope.hot);
        };
}]);