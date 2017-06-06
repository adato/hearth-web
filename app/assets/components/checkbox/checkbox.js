'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.checkbox
 * @description selfdescript
 * @example
 *		<checkbox model="magic.unicorns" required disabled="someExpression('orFunction')">
 *			<span translate="LOOK_PAPA.TRANSCLUSION_WITH_NO_HANDS"></span>
 *		</checkbox>
 * @restrict E
 */

angular.module('hearth.directives').directive('checkbox', [function() {

	return {
		restrict: 'E',
		transclude: true,
		scope: {
			model: '=',
			name: '@?',
			onUpdate: '&?',
			disabled: '=?',
			required: '=?'
		},
		templateUrl: (el, attrs) => {
			return 'assets/components/checkbox/checkbox.html'
		},
		bindToController: true,
		controllerAs: 'ctrl',
		controller: ['$scope', '$attrs', function(scope, $attrs) {

			const ctrl = this

			ctrl.change = () => {
				if (ctrl.disabled) return
				ctrl.model = !ctrl.model
			}

			/**
			 *	Simulate an html behaviour - if the attr is there, it is true no matter its value
			 *	Also the truthness doesn't change with changes on the element
			 *	if this ever needs to be changed or extended - $attrs.$observe() should be a good start
			 */
			if ($attrs.required !== void 0) ctrl.required = true

		}],
		link: function(scope, el, attrs, ctrl) {

			// keyboard support - toggle checkbox on spacebar press
			const SPACE = 32
			el[0].querySelector('[checkbox-keypress-handler]').addEventListener('keypress', event => {
				const key = event.keyCode || event.charCode
				if (key === SPACE) {

					// space simulates a page-down by default - prevent this
					event.preventDefault()

					if (ctrl.disabled) return

					ctrl.model = !ctrl.model
					if (!scope.$$phase) scope.$apply()
				}
			})

		}
	}

}])