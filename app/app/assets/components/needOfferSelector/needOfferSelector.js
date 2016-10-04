'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.needofferselector
 * @description Switches between need and offer
 * @restrict E
 */
angular.module('hearth.directives').directive('needofferselector',
	function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				model: '=',
				textTrue: '@',
				iconTrue: '@',
				textFalse: '@',
				iconFalse: '@',
				ngDisabled: '=',
				requiredShown: '='
			},
			templateUrl: 'templates/directives/needOfferSelector.html',
			link: function(scope) {
				scope.requiredMessageShown = scope.requiredShown !== void 0 ? scope.requiredShown : false;
				scope.$watch('requiredShown', function(value) {
					scope.requiredMessageShown = value;
				});
				scope.$watch('model', function(value) {
					scope.requiredMessageShown = false;
					scope.model = value;
				});
			}
		};
	}
);