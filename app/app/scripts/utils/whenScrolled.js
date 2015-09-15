'use strict';

/**
 * @ngdoc directive
 * @name hearth.utils.whenScrolled
 * @description Solves toilet paper scrolling
 * @restrict A
 */

angular.module('hearth.utils').directive('whenScrolled', [
	"$timeout",
	function($timeout) {
		return {
			restrict: 'A',
			scope: {
				loadingInProgress: '=',	// lock - dont overhelm callback
				whenScrolled: '&',		// callback funct to call when scroller
				innerScrolling: '=',	// if we scroll in inner div or in window
				offset: '='
			},
			link: function(scope, element, attr) {
				var el = scope.innerScrolling ? element : angular.element(window),
					offset = scope.offset || 100,
					innerHeight = el[0].innerHeight;
				var currentScrollTop, lastScrollTop;

				function process ($event) {
					if(scope.loadingInProgress)
						return false;

					// disable when modal is shown
					if (angular.element('body').hasClass('ngdialog-open')) return false;
					
					var childHeight = scope.innerScrolling ? el.children().height() : angular.element(document).height();

					if(childHeight - el.height() - el.scrollTop() - offset <= 0)
						scope.whenScrolled();
				}

				function processWithResite () {
					innerHeight = el[0].innerHeight;
					process();
				}

				scope.$watch('loadingInProgress', function(val) {
					!val && process();
				});

				el.bind('scroll', process)
				angular.element(window).bind('resize', processWithResite);

				scope.$on('$destroy', function() {
					el.unbind('scroll', process);
					angular.element(window).unbind('resize', processWithResite);
					el = null;
				});
			}
		};
	}
]);