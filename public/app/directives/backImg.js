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