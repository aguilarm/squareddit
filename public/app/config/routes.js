squareddit.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                views: {
                    'statusbar': {
                        templateUrl: '/app/views/statusbar/home.html',
                        controller: 'menuControls'
                    },
                    'content': {
                        templateUrl: '/app/views/home.html',
                        controller: 'listPosts'
                    },
                    'menu': {
                        templateUrl: '/app/views/menu/home.html',
                        controller: 'menuControls'
                    }
                },
                resolve: {
                    post: ['posts', function (posts) {
                        return posts.getPosts('cityPorn', 'hot', false);
                    }]
                }
            })
            .state('subreddit', {
                url: '/r/:subreddit',
                views: {
                    'statusbar': {
                        templateUrl: 'app/views/statusbar/home.html',
                        controller: 'menuControls'
                    },
                    'content': {
                        templateUrl: 'app/views/home.html',
                        controller: 'listPosts'
                    },
                    'menu': {
                        templateUrl: 'app/views/menu/home.html',
                        controller: 'menuControls'
                    }
                },
                resolve: {
                    post: ['$stateParams', 'posts', function ($stateParams, posts) {
                        return posts.getPosts($stateParams.subreddit, 'hot', false);
                    }]
                }
        });
            
        $urlRouterProvider.otherwise('/');
        
        $locationProvider.html5Mode({
            enabled: true
        });
        
}]);