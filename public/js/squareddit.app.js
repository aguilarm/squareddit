'use strict';

//define and start up the application

var squareddit = angular.module('squareddit', ['ui.router']);
squareddit.factory('ids', function idsFactory() {
    return {
        imgurID: '61fb2e136eeaa2c'
    };
});
'use strict';

squareddit.factory('posts', ['$http', 'ids', function postsFactory($http, ids) {
    var current = [],
        currentSub = 'cityporn',
        loading = false,
        after,
        processImgur = function (data) {
            return;
        },
        processImages = function (data) {
            for (var i = 0; i < data.length; i++) {
                var post = data[i].data,
                    hasExt = (/\.(gif|jpg|jpeg|tiff|png)$/i).test(post.url);
                //if it's a sticky post, don't display it.
                if (post.stickied) {
                    data.splice(i,1);
                    i = i - 1;
                    console.log('sticky');
                    continue;
                }
                if (post.domain.search("imgur") >= 0 && hasExt === false) {
                    //imgur will serve the correct image no matter what extension you put in the address...
                    post.url += '.jpg';
                    console.log('imgur.jpg');
                    continue;
                } 
                if (hasExt === false) {
                    data.splice(i,1);
                    i = i - 1;
                }
            }
            return data;
        };
    return {
        getPosts: function (subreddit, sortMethod, pageUp) {
            if (loading) return;
            loading = true;
            
            if (!sortMethod) 
                sortMethod = 'hot';
            
            if (subreddit != currentSub) {
                var blank=[];
                angular.copy(blank, current);
            }
            
            currentSub = subreddit;
            
            var url = 'http://www.reddit.com/r/' + subreddit + '/' + sortMethod + '.json';
            
            if (after && pageUp)
                url += after;
                
            return $http.get(url).
                success(function (response) {
                    var imgs = processImages(response.data.children);
                    
                    for (var i = 0; i < imgs.length; i++) {
                            current.push(imgs[i].data);
                    }
                    
                    console.log(current);
                    
                    after = '?after=' + imgs[imgs.length-1].data.name;
                    loading = false;
                });
        },
        current: current,
        currentSub: currentSub,
    };
}]);
'use strict';

squareddit.controller('listPosts', ['$scope', 'posts',
    function ($scope, posts) {
        var postsLength = document.getElementById('sr-posts').offsetHeight,
            winH = window.innerHeight,
            halfWinH = winH/2,
            scrollPosBottom,
            threshold;
        $scope.posts = posts;
        setInterval(function() {
            scrollPosBottom = window.pageYOffset + winH;
            postsLength = document.getElementById('sr-posts').offsetHeight;
            threshold = postsLength - winH;
            if (scrollPosBottom >= threshold)
                posts.getPosts(posts.currentSub, 'hot', true);
                
        }, 300);
        
        
        
        
            
            
}]);
'use strict';

squareddit.controller('menuControls', ['$scope', 'posts',
    function ($scope, posts) {
        $scope.posts = posts;
        $scope.updatePosts = function () {
            posts.getPosts(posts.currentSub, 'hot');
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
                },
                resolve: {
                    post: ['posts', function (posts) {
                        return posts.getPosts('cityporn', 'hot', false);
                    }]
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
        
        if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(url)) {
            element.css({'background-color':'#000'});
            return;
        }
        
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover',
            'background-position' : '50% 50%'
        });
    };
});