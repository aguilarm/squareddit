'use strict';

//define and start up the application

var squareddit = angular.module('squareddit', ['ui.router']);
'use strict';

squareddit.factory('posts', ['$http', function postsFactory($http) {
    var o = {
        posts: []
    };
    o.getHot = function (subreddit) {
        return $http.get('http://www.reddit.com/r/' + subreddit + '/hot.json');
    };
    o.curHot = {};
    o.processImages = function (data) {
        //todo this should add img tags/change for flickr and imgur links with no extension
        return data;
    };
    return o;
}]);
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
squareddit.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                views: {
                    'main': {
                        templateUrl: '/app/views/home.html',
                        controller: 'listPosts'
                    },
                    'menu': {
                        templateUrl: '/app/views/menu/home.html',
                        controller: 'listPosts'
                    }
                }
        });
            
        $urlRouterProvider.otherwise('/');
        
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        
}]);
squareddit.directive('backimg', function(){
    return function(scope, element, attrs){
        var url = attrs.backimg;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
    };
});