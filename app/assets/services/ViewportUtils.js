'use strict';

/**
 * @ngdoc factory
 * @name hearth.services.ViewportUtils
 * @description functions working with viewport
 */

angular.module('hearth.services').factory('ViewportUtils', ['$window', '$document',
	function($window, $document) {

		var screenCenterScrollTop

		const factory = {
			getScreenCenterScrollTop,
			getTopOffset,
			isInViewport
		}

		return factory

		///////////////////

		function getScreenCenterScrollTop() {
			return screenCenterScrollTop + $window.innerHeight / 2
		}

		function getTopOffset(el) {
			if (!el) throw new TypeError('Element required for getTopOffset to work.')
			var box = el.getBoundingClientRect()
			var body = $document[0].body
			var docElem = $document[0].documentElement
			var clientTop = docElem.clientTop || body.clientTop || 0

			screenCenterScrollTop = $window.pageYOffset || docElem.scrollTop || body.scrollTop
			return box.top + screenCenterScrollTop - clientTop
		}

		/**
		 *	Function that checks whether an element is currently in the viewport
		 *	@param el - DOM Node .. NOT jQuery object
		 *	@return Boolean
		 */
		function isInViewport(el) {
			if (!el) return false
			var rect = el.getBoundingClientRect()
			return (
				rect.top >= 0 &&
				rect.left >= 0 &&
				rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
				rect.right <= (window.innerWidth || document.documentElement.clientWidth)
			)
		}

	}
])