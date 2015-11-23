'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.radio
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('radio', function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: {
			model: '=',
			value: '=',
			valueOff: '=',
			onUpdate: '&',
			ngDisabled: '='
		},
		templateUrl: 'templates/directives/radio.html',
		link: function(scope) {
			scope.checked = false;

			scope.toggle = function() {
				if (scope.ngDisabled)
					return false;

				if (!scope.checked) {
					scope.checked = !scope.checked;
				}

				if (angular.isArray(scope.model)) {
					var index = scope.model.indexOf(scope.value);
					if (index > -1) {
						scope.model.splice(index, 1);
					} else {
						scope.model.push(scope.value);
					}
				} else {
					if (typeof scope.model !== 'undefined') {
						scope.model = scope.checked ? scope.value : scope.valueOff;
					}
				}

				if (scope.onUpdate)
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
