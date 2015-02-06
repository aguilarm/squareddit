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