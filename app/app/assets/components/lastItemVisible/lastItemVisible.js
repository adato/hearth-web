'use strict';

angular.module('hearth.directives').directive('lastItemVisible', [
	"$timeout", "ViewportUtils",
	function($timeout, ViewportUtils) {
		return {
			restrict: 'A',
			scope: {
				lastVisible: '&'
			},
			link: function(scope, el) {
				var watcher;
				if (scope.$parent.$last) {
					$timeout(function() {
						if (ViewportUtils.isInViewport(el[0])) {
							scope.lastVisible();
						}
					}, 100);

					watcher = angular.element(el[0].parentNode.parentNode);
					watcher.on('scroll', function() {
						return ViewportUtils.isInViewport(el[0]) ? scope.lastVisible() : false;
					});

				}

				scope.$on('conversationRemoved', function() {
					if (scope.$parent.$last) {
						if (ViewportUtils.isInViewport(el[0])) {
							console.log("REMOVED ");
							scope.lastVisible();
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