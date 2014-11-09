'use strict';

//define and start up the application

var squareddit = angular.module('squareddit', ['ui.router']);
'use strict';

squareddit.factory('posts', ['$http', function postsFactory($http) {
    var o = {
        posts: []
    };
    o.getHot = function (subreddit) {
        return $http.get('http://www.reddit.com/r/funny/hot.json').
                then(function (res) {
                    return res.data;
                });
        };
    return o;
}]);
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
squareddit.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/app/views/home.html',
                controller: 'listPosts'
        });
            
        $urlRouterProvider.otherwise('/');
        
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        
}]);