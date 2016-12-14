'use strict';

/**
 * @ngdoc factory
 * @name hearth.services.ScrollService
 * @description Service for scroll related features
 */

angular.module('hearth.services').factory('ScrollService', ['$window', '$timeout', function($window, $timeout) {

	var MARKETPLACE_SCROLL_TO_PARAM = 'postdetail';

	var factory = {
		MARKETPLACE_SCROLL_TO_PARAM: MARKETPLACE_SCROLL_TO_PARAM,
		scrollToElement: scrollToElement,
		scrollTop: scrollTop,
		scrollToError: scrollToError
	};

	return factory;

	/////////////////

	/**
	 *	Scrolls the viewport to the given element [in a given container][ with an offset]
	 *
	 *	@param element - the DOM node to scroll to
	 *	@param cont - the container of the element
	 *	@param offset
	 */
	function scrollToElement(element, cont, offset) {
		// validate offset
		offset = (!isNaN(parseFloat(offset)) && isFinite(offset)) ? offset : 200;
		// set container
		var container = cont || 'html, body';
		var elementPos;

		// if element cannot be found, don't go any further
		if (!$(element).first().length) return false;

		elementPos = Math.max($(element).first().offset().top - offset, 0);
		$(container).animate({
			scrollTop: elementPos
		}, 'slow');
	}

	/**
	 *	Scrolls the viewport to the top
	 */
	function scrollTop(offset, delay) {
		$('html, body').animate({
			scrollTop: offset || 0
		}, delay || 1000);
	}

	/**
	 *	Scrolls the viewport to the given element or first error message on page
	 */
	function scrollToError(el, cont) {
		$timeout(function() {
			scrollToElement(el || $('.error').not('.alert-box,.ng-hide'), cont);
		});
	};

}]);