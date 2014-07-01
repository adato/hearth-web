'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.checkbox
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('checkbox', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: {
			model: '=',
			value: '='
		},
		templateUrl: 'templates/checkbox.html',
		link: function(scope, el, attrs) {
			scope.checked = false

			scope.toggle = function() {
				scope.checked = !scope.checked;

				scope.model = scope.checked ? scope.value : undefined;
			};
		}
	};
});