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