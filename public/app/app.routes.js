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
                        templateUrl: '/app/shared/statusbar/statusbarView.html',
                        controller: 'statusbarController'
                    },
                    'content': {
                        templateUrl: '/app/components/home/homeView.html',
                        controller: 'homeController'
                    },
                    'sidebar': {
                        templateUrl: '/app/shared/sidebar/sidebarView.html',
                        controller: 'sidebarController'
                    }
                },
                resolve: {
                    post: ['redditPosts', function (redditPosts) {
                        return redditPosts.getPosts('cityPorn', 'hot', false);
                    }],
                    user: ['redditAuth', function (redditAuth) {
                        return redditAuth.getUser();
                    }]
                }
        });
            
        $urlRouterProvider.otherwise('/');
        
        $locationProvider.html5Mode({
            enabled: true
        });
        
}]);