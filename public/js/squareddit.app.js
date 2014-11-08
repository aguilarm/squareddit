squareddit.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/app/views/home.html',
                controller: 'listPosts',
                resolve: {
                    postPromise: ['posts', function (posts) {
                        return posts.getHot(all);
                    }]
                }
        });
            
        $urlRouterProvider.otherwise('/home');
        
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        
}]);