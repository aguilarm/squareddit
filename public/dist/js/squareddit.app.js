'use strict';

//define and start up the application

var squareddit = angular.module('squareddit', ['ui.router', 'ngMaterial']);
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
squareddit.controller('homeController', [
    '$scope', '$document', 'redditPosts', 'redditAuth', 'redditUser',
    function ($scope, $document, redditPosts, redditAuth, redditUser) {
        var postsLength = document.getElementById('sr-posts').offsetHeight,
            winH = window.innerHeight,
            scrollPosBottom,
            threshold;
            
        $scope.posts = redditPosts;
        $scope.auth = redditAuth;
        
        setInterval(function() {
            scrollPosBottom = window.pageYOffset + winH;
            postsLength = document.getElementById('sr-posts').offsetHeight;
            threshold = postsLength - winH;
            if (scrollPosBottom >= threshold && threshold > winH*0.8)
                redditPosts.getPosts(redditPosts.currentSub, 'hot', true);
        }, 500);
        
        $scope.vote = function ($event, postID, dir) {
            var voteButton = $event.target.parentNode;
            
            $event.preventDefault();
            $event.stopPropagation();
            
            if (redditAuth.loggedIn === false) {
                alert('You must be logged in to do that!');
                return;
            }
            
            //send a 0 (reset) dir if an active element is clicked
            if (dir !== 0 && voteButton.className.indexOf('sr-post-voted') >= 0) {
                console.log('reset');
                redditUser.vote(postID, 0);
                voteButton.className = 
                    voteButton.className.replace(' sr-post-voted', '');
                return;
            }
            
            console.log('VOTING');
            redditUser.vote(postID, dir);
            
            voteButton.className += ' sr-post-voted';
            
        };
            
}]);
squareddit.directive('backimg', function(){
    return {
        
        restrict: 'A',
        
        link: function(scope, element, attrs){
            var url = attrs.backimg,
                img = new Image();
            img.onload = function () {
                element.css({
                    'background-image': 'url(' + url +')',
                    'background-size' : 'cover',
                    'background-position' : '50% 50%'
                });
            };
            img.src = url;
        }
    };
});
squareddit.directive('srKeybindings', [
    '$document',
    function ($document, $rootScope) {
        return {
            restrict: 'A', 
            
            link: function() {
                
                var winH = window.innerHeight;
                
                $document.on('keydown', function (e) {
                    if (e.keyCode === 40) {
                        e.preventDefault();
                        window.scrollBy(0, winH);
                    }
                    if (e.keyCode === 38) {
                        e.preventDefault();
                        window.scrollBy(0, -winH);
                    }
                    if (e.keyCode === 37) {
                        e.preventDefault();
                        window.scrollBy(0, -winH);
                    }
                    if (e.keyCode === 39) {
                        e.preventDefault();
                        window.scrollBy(0, winH);
                    }
                })
            }
        };
    }
]);
squareddit.directive('post', function(){
    return {
        
        restrict: 'E',
        
        templateUrl: '/app/shared/directives/post/postTemplate.html',
        
    };
});
squareddit.factory('redditAuth', ['$http', function authFactory($http) {
    var authServ = {};
    
    authServ.loggedIn = false;
    authServ.user = {};
    authServ.showLogin = false;
    
    authServ.getUser = function getUser() {
            return $http.get('/user/account').
                success(function (data) {
                    if (data.name) {
                        authServ.loggedIn = true;
                        authServ.user = data._json;
                    } else {
                        authServ.loggedIn = false;
                    }
                }).
                error(function (data, status) {
                    authServ.loggedIn = false;
                    console.log('log in check failed');
                    return;
                });
        };
        
    return authServ;
    
}]);
squareddit.factory('redditPosts', ['$http', function postsFactory($http) {
    
    //declare posts and a few scoped helper vars
    var posts = {},
        loading = false,
        after;
    
    posts.current = [];
    //init with 'hot' as default, will change soon
    posts.currentSort = 'hot';
    posts.loading = false;
    posts.after = '';
    posts.processImages = function processImages(v, i, arr) {
        var post = v.data,
            hasExt = (/\.(gif|gifv|jpg|jpeg|tiff|png)$/i).test(post.url);
                
        if(post.stickied)
            return;
                
        //imgur will grab the right image regardless of format
        //most of the time if an imgur link has no ext, adding one is safe
        //and makes it load properly.  need a proper fix for albums
        if(post.domain.search("imgur") >= 0 && hasExt === false)
            post.url += '.jpg';
                
        //not imgur and no extension?  not displayed.
        if(post.domain.search("imgur") === -1 && hasExt === false)
            return;
            
        return v;
    };
    
    posts.getPosts = function (subreddit, sortMethod, pageUp) {
        if (loading) return;
        loading = true;
            
        if (!sortMethod) 
            sortMethod = 'hot';
        if (!posts.cachedSubreddit)
            posts.cachedSubreddit = posts.current.sub;
            
        posts.currentSort = sortMethod;
            
        if (!subreddit)
            subreddit = posts.current.sub;
        if (!posts.current.sub)
            posts.current.sub = subreddit;
        
        if(posts.cachedSubreddit) {
            if (posts.cachedSubreddit.toLowerCase() != posts.current.sub.toLowerCase()) {
                var blank=[];
                posts.angular.copy(blank, posts.current);
            }
        }
            
        posts.cachedSubreddit = subreddit;
        
        var url = 'https://www.reddit.com/r/' + subreddit + '/' + sortMethod + '.json';
            
        if (after && pageUp)
            url += after;
                
        return $http.get(url).
            success(function (response) {
                var imgs = response.data.children.filter(posts.processImages);
                    
                for (var i = 0; i < imgs.length; i++) {
                    posts.current.push(imgs[i].data);
                }
                    
                if (posts.current.length === 0) {
                    console.log('Error loading reddit page!');
                    loading = false;
                    return;
                }
                    
                after = '?after=' + imgs[imgs.length-1].data.name;
                loading = false;
            }).
            error(function (data, status) {
                loading = false;
                return ;
            });
    };
    
    return posts;
    
}]);
squareddit.factory('redditUser', ['$http', function usersFactory($http) {
    var userServ = {};
    
    userServ.vote = function vote(postId, voteDir) {
        return $http.post('/user/vote',
            {
                id: postId,
                dir: voteDir
            }).success(function (data) {
                console.log('vote successful');
                return;
            }).error(function() {
                console.log('vote for ' + postId + ' unsuccessful!');
                return;
            });
    };
    
    return userServ;
}]);
squareddit.controller('sidebarController', ['$scope', 'redditPosts', 'redditAuth',
    function ($scope, redditPosts, redditAuth) {
        $scope.posts = redditPosts;
        $scope.auth = redditAuth;
        
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
        
        $scope.logIn = function menuLogIn(user, pass, rem) {
            if(!user || !pass) {
                alert('Username and password required!');
                return;
            }
            
            redditAuth.showLogin = false;
            redditAuth.logIn(user, pass, rem);
        }
}]);
squareddit.controller('statusbarController', ['$scope', 'redditPosts', 'redditAuth',
    function ($scope, redditPosts, redditAuth) {
        $scope.posts = redditPosts;
        $scope.auth = redditAuth;
        
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
        
        $scope.logIn = function menuLogIn(user, pass, rem) {
            if(!user || !pass) {
                alert('Username and password required!');
                return;
            }
            
            redditAuth.showLogin = false;
            redditAuth.logIn(user, pass, rem);
        }
}]);