'use strict';

/**
 * @ngdoc directive
 * @name hearth.utils.whenScrolled
 * @description Solves toilet paper scrolling
 * @restrict A
 */

angular.module('hearth.utils').directive('whenScrolled', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			var lastRun = null,
				raw = element[0],
				offset = 1000;

			function process ($event) {
				var rectObject = raw.getBoundingClientRect(),
					bottom = parseInt(rectObject.bottom, 10),
					lock = false;

				if (bottom > 0 && bottom - offset <= parseInt(window.innerHeight) ) {
					$event.stopPropagation();
					$event.preventDefault();
					if (lastRun + 2000 < new Date().getTime() && ! lock) {
						lock = true;
						scope.$apply(attr.whenScrolled);
						lastRun = new Date().getTime();
						return lastRun;
					}
				} else {
					lock = false;
				}
			}

			angular.element(window).bind('scroll', process);
			angular.element(window).bind('resize', process);
		}
	};
});