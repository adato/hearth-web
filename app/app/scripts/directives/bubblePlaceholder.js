'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.bubblePlaceholder
 * @description
 * @restrict A
 */

angular.module('hearth.directives').directive('bubblePlaceholder', [
	'Bubble',
	function(Bubble) {
		return {
			restrict: 'A',
			scope: {
				bubblePlaceholder: '@'
			},
			link: function(scope) {
				Bubble.try(scope.bubblePlaceholder);
			}
		};
	}
]);