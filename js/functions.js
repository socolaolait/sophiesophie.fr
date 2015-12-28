(function($) {
  var winWidth = window.innerWidth;
  var winHeight = window.innerHeight;
  var num = 150;
  var duration = 5000;

  for (var i = 0; i<num; i++) {
    var $bubble = $('<span />' ,{
      'class': 'bubble'
    });
    $('.js-animate').append($bubble);

    var size = Math.floor((Math.random() * 50) + 10);
    var top = Math.floor(((Math.random() * winHeight) + 1) * 100 / winHeight);
    var left = Math.floor(((Math.random() * winWidth) + 1) * 100 / winWidth);

    $bubble.css('width', size);
    $bubble.css('height', size);
    $bubble.css('top', top + '%');
    $bubble.css('left', left + '%');

    moveRandom($bubble);
  }

  function randomFromTo(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

  function moveRandom(obj) {
    // taille des bulles
    var bHeight = obj.height();
    var bWidth = obj.width();

    // maximum position
    var maxY = winHeight - bHeight;
    var maxX = winWidth - bWidth;

    // nouvelle position
    var newY = Math.floor(randomFromTo(0, maxY) * 100 / winHeight);
    var newX = Math.floor(randomFromTo(0, maxX) * 100 / winWidth);

    var newSize = Math.floor(Math.random() * 50) + 10;

    obj.animate({
      top: newY + '%',
      left: newX + '%',
      width: newSize,
      height: newSize
      }, duration, function() {
        moveRandom(obj);
    });
  }

})(jQuery);
