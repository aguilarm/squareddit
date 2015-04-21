squareddit.directive('srEndlessReload', function(){
    return {
        
        restrict: 'A',
        
        link: function(scope, element, attrs){
            console.log(attrs);
        }
    };
});