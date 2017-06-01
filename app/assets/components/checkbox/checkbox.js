'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.checkbox
 * @description
 * @example
 *		<checkbox model="filter.user" value="true">
 *			<span translate="MARKETPLACE.FILTER.INDIVIDUALS"></span>
 *		</checkbox>
 * @restrict E
 */

angular.module('hearth.directives').directive('checkbox', [function() {

	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: {
			model: '=',
			value: '=',
			valueOff: '=',
			onUpdate: '&',
			disable: '=?'
		},
		templateUrl: (el, attrs) => {
			return 'assets/components/checkbox/checkbox.html'
		},
		link: function(scope, el) {
			scope.checked = false

			scope.toggle = function() {
				if (scope.disable) return;
				scope.checked = !scope.checked

				if (angular.isArray(scope.model)) {
					const index = scope.model.indexOf(scope.value)
					if (index > -1) {
						scope.model.splice(index, 1)
					} else {
						scope.model.push(scope.value)
					}
				} else {
					scope.model = scope.checked ? scope.value : scope.valueOff
				}

				if (scope.onUpdate) scope.onUpdate({value: scope.model})
			}

			// keyboard support - toggle checkbox on spacebar press
			const SPACE = 32
			el[0].querySelector('.qs-keypress-event-handle').addEventListener('keypress', event => {
				const key = event.keyCode || event.charCode
				if (key === SPACE) {
					scope.toggle()
					if (!scope.$$phase) scope.$apply()

					// space simulates a page-down by default - prevent this
					event.preventDefault()
				}
			})

			scope.$watch('model', value => {
				if (angular.isArray(scope.model)) {
					var index = scope.model.indexOf(value)
					scope.checked = index > -1
				} else {
					scope.checked = value === scope.value
				}
			})

		}
	}

}])