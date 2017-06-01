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
			name: '=?',
			onUpdate: '&',
			disable: '=?'
		},
		templateUrl: (el, attrs) => {
			return 'assets/components/checkbox/checkbox.html'
		},
		bindToController: true,
		controllerAs: 'ctrl',
		controller: ['$scope', function(scope) {



		}],
		link: function(scope, el, attrs, ctrl) {

			// keyboard support - toggle checkbox on spacebar press
			const SPACE = 32
			el[0].querySelector('[checkbox-keypress-handler]').addEventListener('keypress', event => {
				const key = event.keyCode || event.charCode
				if (key === SPACE) {
					console.log('SPACE', ctrl);
					// scope.toggle()
					ctrl.model = (ctrl.model === ctrl.value) ? ctrl.valueOff : ctrl.value
					// if (!scope.$$phase) scope.$apply()

					// space simulates a page-down by default - prevent this
					event.preventDefault()
				}
			})

		}
	}

}])