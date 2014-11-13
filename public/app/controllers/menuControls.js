'use strict';

squareddit.controller('menuControls', ['$scope', 'posts',
    function ($scope, posts) {
        $scope.posts = posts;
        $scope.updatePosts = function () {
            console.log(posts.currentSub);
            posts.getHot(posts.currentSub);
        };
        $scope.showPosts = function () {
            console.log($scope.hot);
        };
}]);