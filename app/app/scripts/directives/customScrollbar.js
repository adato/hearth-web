'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.customScrollbar
 * @description Applies custom scrollbar to element
 * @restrict A
 */
angular.module('hearth.directives').directive('customScrollbar', [
	'$rootScope', '$timeout',
	function($rootScope, $timeout) {
		return {
			restrict: 'A',
			replace: true,
			scope: false,
			template: false,
			link: function(scope, element, attrs) {
				function addScrollbar() {
					$(element).nanoScroller();
				}

				$timeout(addScrollbar);
				scope.$on("scrollbarResize", addScrollbar);
			}
		};
	}
]);
