'use strict';

//define and start up the application

var squareddit = angular.module('squareddit', ['ui.router']);
'use strict';

squareddit.factory('posts', ['$http', function postsFactory($http) {
    var currentHot = {},
        currentSub = 'cityporn',
        processImages = function (data) {
            //todo this should add img tags/change for flickr and imgur links with no extension
            return data;
        };
    return {
        getHot: function (subreddit) {
            return $http.get('http://www.reddit.com/r/' + subreddit + '/hot.json').
                success(function (response) {
                    var data = response.data.children;
                    currentHot = data;
                });
        },
        currentHot: currentHot,
        currentSub: currentSub
    };
}]);
'use strict';

squareddit.controller('listPosts', ['$scope', 'posts',
    function ($scope, posts) {
        $scope.hot = posts.currentHot;
}]);
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
squareddit.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                views: {
                    'content': {
                        templateUrl: '/app/views/home.html',
                        controller: 'listPosts'
                    },
                    'menu': {
                        templateUrl: '/app/views/menu/home.html',
                        controller: 'menuControls'
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