'use strict';

//define and start up the application

var squareddit = angular.module('squareddit', ['ui.router']);
squareddit.factory('auth', ['$http', function authFactory($http) {
    
}]);
'use strict';

squareddit.factory('posts', ['$http', function postsFactory($http) {
    var current = [],
        currentSort = 'hot',
        cachedSubreddit,
        loading = false,
        after,
        error = '',
        processImgur = function (data) {
            return;
        },
        processImages = function (v, i , arr) {
            var post = v.data,
                hasExt = (/\.(gif|gifv|jpg|jpeg|tiff|png)$/i).test(post.url);
                
            if(post.stickied)
                return;
                
            if(post.url.substring(0,5) === "http:") {
                var https = post.url.replace("http:", "https:");
                post.url = https;
            }
                
            //imgur will grab the right image regardless of format
            if(post.domain.search("imgur") >= 0 && hasExt === false)
                post.url += '.jpg';
                
            //not imgur and no extension?  not displayed.
            if(post.domain.search("imgur") === -1 && hasExt === false)
                return;
            
            return v;
        };
    return {
        getPosts: function (subreddit, sortMethod, pageUp) {
            if (loading) return;
            loading = true;
            
            if (!sortMethod) 
                sortMethod = 'hot';
            if (!cachedSubreddit)
                cachedSubreddit = current.sub;
            console.log(cachedSubreddit);
            currentSort = sortMethod;
            console.log(subreddit);
            console.log(current.sub);
            if (!subreddit)
                subreddit = current.sub;
            if (!current.sub)
                current.sub = subreddit;
            
            if(cachedSubreddit) {
                if (cachedSubreddit.toLowerCase() != current.sub.toLowerCase()) {
                    var blank=[];
                    angular.copy(blank, current);
                }
            }
            
            cachedSubreddit = subreddit;
            
            var url = 'https://www.reddit.com/r/' + subreddit + '/' + sortMethod + '.json';
            
            if (after && pageUp)
                url += after;
                
            return $http.get(url).
                success(function (response) {
                    var imgs = response.data.children.filter(processImages);
                    
                    for (var i = 0; i < imgs.length; i++) {
                        current.push(imgs[i].data);
                    }
                    
                    if (current.length === 0) {
                        error = "No images or bad subreddit!";
                        console.log('Error loading reddit page!');
                        loading = false;
                        return error;
                    }
                    
                    after = '?after=' + imgs[imgs.length-1].data.name;
                    loading = false;
                }).
                error(function (data, status) {
                    error = "Request failed - error communicating with reddit.";
                    loading = false;
                    return error;
                });
        },
        current: current,
        currentSort: currentSort,
        error: error,
    };
}]);
'use strict';

squareddit.controller('listPosts', ['$scope', '$document', 'posts',
    function ($scope, $document, posts) {
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
            if (scrollPosBottom >= threshold && threshold > winH*0.8)
                posts.getPosts(posts.currentSub, 'hot', true);
        }, 500);
        
        $document.on('keydown', function(e) {
            if (e.keyCode === 40) {
                e.preventDefault();
                window.scrollBy(0,winH);
            }
            if (e.keyCode === 38) {
                e.preventDefault();
                window.scrollBy(0,-winH);
            }
            if (e.keyCode === 37) {
                e.preventDefault();
                window.scrollBy(0, -winH);
            }
            if (e.keyCode === 39) {
                e.preventDefault();
                window.scrollBy(0, winH);
            }
        });
        
        
            
            
}]);
'use strict';

squareddit.controller('menuControls', ['$scope', 'posts',
    function ($scope, posts) {
        $scope.posts = posts;
        
        $scope.sortMethods = [
            'hot',
            'new',
            'rising',
            'controversial',
            'top',
            'gilded'
        ];
        
        $scope.updatePosts = function () {
            posts.getPosts(posts.current.sub, 'hot');
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
squareddit.directive('backimg', function(){
    return function(scope, element, attrs){
        var url = attrs.backimg; 
        
        //url is not an image:
        if (!(/\.(gif|gifv|jpg|jpeg|tiff|png)$/i).test(url)) {
            //TODO make an error image rather than this
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