'use strict';

//define and start up the application

var squareddit = angular.module('squareddit', ['ui.router']);
squareddit.factory('auth', ['$http', function authFactory($http) {
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
                
            currentSort = sortMethod;
            
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
squareddit.factory('redditUser', ['$http', function usersFactory($http) {
    var userServ = {};
    
    userServ.vote = function vote(postId, voteDir) {
        return $http.post('/user/vote',
            {
                id: postId,
                dir: voteDir
            }).success(function (data) {
                console.log('vote successful');
            }).error(function() {
                console.log('vote for ' + postId + ' unsuccessful!');
            });
    };
    
    return userServ;
}]);
'use strict';

squareddit.controller('listPosts', [
    '$scope', '$document', 'posts', 'auth', 'redditUser',
    function ($scope, $document, posts, auth, redditUser) {
        var postsLength = document.getElementById('sr-posts').offsetHeight,
            winH = window.innerHeight,
            scrollPosBottom,
            threshold;
        $scope.posts = posts;
        $scope.auth = auth;
        
        setInterval(function() {
            scrollPosBottom = window.pageYOffset + winH;
            postsLength = document.getElementById('sr-posts').offsetHeight;
            threshold = postsLength - winH;
            if (scrollPosBottom >= threshold && threshold > winH*0.8)
                posts.getPosts(posts.currentSub, 'hot', true);
        }, 500);
        
        $scope.vote = function ($event, postID, dir) {
            var voteButton = $event.target.parentNode;
            
            $event.preventDefault();
            $event.stopPropagation();
            
            if (auth.loggedIn === false) {
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

squareddit.controller('menuControls', ['$scope', 'posts', 'auth',
    function ($scope, posts, auth) {
        $scope.posts = posts;
        $scope.auth = auth;
        
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
            
            auth.showLogin = false;
            auth.logIn(user, pass, rem);
        }
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
                    }],
                    user: ['auth', function (auth) {
                        return auth.getUser();
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