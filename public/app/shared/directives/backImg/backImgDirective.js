squareddit.directive('srBackImg', function(){
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