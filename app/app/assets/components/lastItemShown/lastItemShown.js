'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.lastItemShown
 * @description Check, if element is visible in the view area. If the element is shown, lastItemShown is triggered.
 * @restrict A
 */
angular.module('hearth.directives').directive('lastItemShown', [
	"$timeout", "ViewportUtils",
	function($timeout, ViewportUtils) {
		return {
			restrict: 'A',
			scope: {
				lastItemShown: '&'
			},
			link: function(scope, el) {
				var watcher;
				if (scope.$parent.$last) {
					$timeout(function() {
						if (ViewportUtils.isInViewport(el[0])) {
							scope.lastItemShown();
						}
					}, 100);

					watcher = angular.element(el[0].parentNode.parentNode);
					watcher.on('scroll', function() {
						return ViewportUtils.isInViewport(el[0]) ? scope.lastItemShown() : false;
					});

				}

				scope.$on('conversationRemoved', function() {
					if (scope.$parent.$last) {
						if (ViewportUtils.isInViewport(el[0])) {
							scope.lastItemShown();
						}
					}
				});

				scope.$on('destroy', function() {
					watcher.off('scroll');
				});
			}
		}
	}
]);