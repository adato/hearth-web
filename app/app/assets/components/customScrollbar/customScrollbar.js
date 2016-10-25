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
				var handler;

				function addScrollbar() {
					if (typeof $().nanoScroller !== 'function') return console.error('JQuery module nanoScroller has failed to load.');
					if (typeof handler === 'function') handler();
					$timeout(function(){
						$(element).nanoScroller();
					}, 100);
				}

				$timeout(addScrollbar);
				handler = scope.$on('scrollbarResize', addScrollbar);
			}
		};
	}
]);