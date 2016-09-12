'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.checkCapitals
 * @description
 * @restrict A
 */
angular.module('hearth.directives').directive('checkCapitals', [
	function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				model: '=',
			},
			template: '<div><span ng-if="isLoud">{{:: "ERR_TEXT_TOO_LOUD" | translate }}</span></div>',
			link: function(scope, element, attrs) {
				scope.isLoud = false;
				scope.$watch('model', function(newVal, oldVal) {
					if (typeof newVal != 'undefined' && newVal !== null && newVal.toUpperCase() === newVal) {
						scope.isLoud = true;
					}
				});
			}
		};
	}
]);