'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.dynamicHeight
 * @description Makes element autoresizing based on current window height
 * @restrict A
 */
angular.module('hearth.directives').directive('dynamicHeight', ['$timeout', '$window', '$rootScope',
	function($timeout, $window, $rootScope) {
		return {
			restrict: 'A',
			scope: {
				minHeight: '=?',
				offset: '=?',
				container: '@?'
			},
			link: function(scope, element, attrs) {
				scope.minHeight = scope.minHeight || 200;

				scope.onResize = function() {
					var height = $(scope.container || $window).height() - parseInt(scope.offset);
					$(element).height((height < scope.minHeight) ? scope.minHeight : height);
				}

				var timeout = $timeout(scope.onResize());

				angular.element($window).bind('resize', function() {
					scope.onResize();
				});

				$rootScope.$on("dynamicHeightRedraw", function() {
					$timeout(function() {
						angular.element($window).triggerHandler('resize');
					});
				});

				scope.$on('$destroy', function() {
					$timeout.cancel(timeout);
					angular.element($window).unbind('resize', resizeElement);
				});
			}
		};
	}
]);