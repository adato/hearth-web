function calculateStorySizes()
{
  var viewportHeight = $(window).height();
  var viewportWidth = $(window).width();

  var storiesMargin = 0;
  var storyBgWidth = viewportWidth * 3;

  /* Naive  */
  $('.story-bg').css( 'width', storyBgWidth + "px");
  $('.story-bg').css( 'height', viewportHeight + "px");
  $('.story-bg').css({ 'position': 'absolute', 'z-index': 0 });
  $('.header').css( 'width', viewportWidth + "px");
  $('.story-page').css( 'width', viewportWidth + "px");
  $('.story-page').css( 'height', viewportHeight + "px");
}

(function($) {

  calculateStorySizes();

  $(window).resize(function() {
    calculateStorySizes();
  })

  $(".main").onepage_scroll({
    pagination: true,
    direction: "horizontal",
    updateURL: true
  });

  $('a.btn-continue, a.btn-bottom-continue').bind('click', function (e) {
    e.preventDefault();
    $(".main").moveDown();
  })

}(jQuery));