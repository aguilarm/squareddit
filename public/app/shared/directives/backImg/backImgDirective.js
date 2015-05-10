squareddit.directive('srBackImg', function(){
  return {

    restrict: 'A',

    link: function(scope, elem, attr){
      var url = attr.srBackImg;
      var img = new Image();

      img.onload = function () {
        console.log('BACKIMG LOAD');
        elem.css({
          'background-image': 'url(' + url +')',
          'background-size' : 'cover',
          'background-position' : '50% 50%'
        });
      };
      img.src = url;
    }
  };
});