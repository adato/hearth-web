;(function(window, config) {
	'use strict'

	var $ = window.aeg.$,
 		fe = window.aeg.fe,
		shuffle = window.aeg.shuffle;

	//
	//	SLIDESHOW
	//
	(function(){

		var jumboWrapperSelector = '[jumbo-wrapper]',
			jumboImages = [
				"<div class='jumbo-show show-1'></div>",
				"<div class='jumbo-show show-2'></div>",
				"<div class='jumbo-show show-3'></div>",
				"<div class='jumbo-show show-4'></div>",
				"<div class='jumbo-show show-5'></div>"
			];

		shuffle(jumboImages);

		fe($(jumboWrapperSelector), function(el) {
			for (var i = jumboImages.length;i--;) {
				el.insertAdjacentHTML('afterbegin', jumboImages[i]);
			}
		});
		// add as many dots as there are jumboImages
		var dotStyleWrapper = $('.dotstyle-wrapper ul')[0];
		for (var i = jumboImages.length;i--;) {
			dotStyleWrapper.insertAdjacentHTML('afterbegin', "<li><a href='#'>#</a></li>");
		}

		[].slice.call( document.querySelectorAll( '.jumbo-wrapper' ) ).forEach( function( nav ) {
			new DotNav( nav );
		} );
	})();

})(window);