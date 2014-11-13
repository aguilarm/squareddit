'use strict';

squareddit.controller('menuControls', ['$scope', 'posts',
    function ($scope, posts) {
        $scope.hot = posts.currentHot;
        $scope.subreddit = posts.currentSub;
        $scope.updatePosts = function () {
            if (!$scope.subreddit)
                return 'Error';
            posts.getHot($scope.subreddit);
        };
        $scope.showPosts = function () {
            console.log($scope.hot);
        };
}]);