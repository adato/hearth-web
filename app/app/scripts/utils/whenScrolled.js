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
				raw = element[0];

			angular.element(window).bind('scroll', function($event) {
				var rectObject = raw.getBoundingClientRect(),
					bottom = parseInt(rectObject.bottom, 10);

				if (bottom > 0 && bottom <= parseInt(window.innerHeight)) {
					$event.stopPropagation();
					$event.preventDefault();
					if (lastRun + 2000 < new Date().getTime()) {
						scope.$apply(attr.whenScrolled);
						lastRun = new Date().getTime();
						return lastRun;
					}
				}
			});
		}
	};
});