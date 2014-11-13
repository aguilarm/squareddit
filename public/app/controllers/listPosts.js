'use strict';

squareddit.controller('listPosts', ['$scope', 'posts',
    function ($scope, posts) {
        $scope.hot = posts.currentHot;
}]);