squareddit.directive('backimg', function(){
    return function(scope, element, attrs){
        var url = attrs.backimg;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
    };
});