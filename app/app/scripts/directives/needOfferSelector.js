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
			scope: {
				model: '=',
				textTrue: '@',
				iconTrue: '@',
				textFalse: '@',
				iconFalse: '@',

			},
			templateUrl: 'templates/directives/needOfferSelector.html',
			link: function(scope) {
				
				scope.toggle = function(state) {
					// scope.model = !scope.model;
					scope.model = state;
				};
				scope.$watch('model', function(value) {
					scope.model = value;
				});
			}
		};
	}
);