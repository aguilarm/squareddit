'use strict';

//define and start up the application

var squareddit = angular.module('squareddit', ['ui.router']);
'use strict';

squareddit.factory('posts', ['$http', function postsFactory($http) {
    var o = {
        posts: []
    };
    o.getHot = function (subreddit) {
        console.log('getting hot posts');
        return $http({
                method: 'JSONP',
                url: 'http://www.reddit.com/r/' + subreddit + '/hot.json',
                success: function (data) {
                    angular.copy(data, o.posts);
                }
        });
    };
    return o;
}]);
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