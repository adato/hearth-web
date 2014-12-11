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
		scope: {
			loadingInProgress: '=',
			whenScrolled: '&'
		},
		link: function(scope, element, attr) {
			var raw = element[0],
				offset = 1000,
				innerHeight = parseInt(window.innerHeight);

			scope.$watch('loadingInProgress', function(val) {
				!val && process();
			});

			function process ($event) {
				if(scope.loadingInProgress)
					return false;
				
				var rectObject = raw.getBoundingClientRect(),
					bottom = parseInt(rectObject.bottom, 10);

				if (bottom > 0 && bottom - offset <= innerHeight) {
					scope.whenScrolled();
				}
			}

			function processWithResite () {
				innerHeight = parseInt(window.innerHeight);
				process();
			}

			angular.element(window).bind('scroll', process);
			angular.element(window).bind('resize', processWithResite);
		}
	};
});