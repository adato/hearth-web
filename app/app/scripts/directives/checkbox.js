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
			value: '=',
			valueOff: '=',
			onUpdate: '&'
		},
		templateUrl: 'templates/directives/checkbox.html',
		link: function(scope) {
			scope.checked = false;

			scope.toggle = function() {
				scope.checked = !scope.checked;

				if (angular.isArray(scope.model)) {
					var index = scope.model.indexOf(scope.value);
					if (index > -1) {
						scope.model.splice(index, 1);
					} else {
						scope.model.push(scope.value);
					}
				} else {
					// if(typeof scope.model !== 'undefined') {
						scope.model = scope.checked ? scope.value : scope.valueOff;
					// }
				}

				if(scope.onUpdate)
					scope.onUpdate(scope.model);
			};

			scope.$watch('model', function(value) {
				if (angular.isArray(scope.model)) {
					var index = scope.model.indexOf(value);
					scope.checked = index > -1;
				} else {
					scope.checked = value === scope.value;
				}
			});

		}
	};
});