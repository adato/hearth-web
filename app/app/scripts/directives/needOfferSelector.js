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
				community: '=',
			},
			templateUrl: 'templates/directives/needOfferSelector.html',
			link: function(scope) {
				var value = {
					false: 'offer',
					true: 'need'
				};
				scope.needSelected = false;

				scope.toggleNeed = function() {
					scope.needSelected = !scope.needSelected;
					scope.model = value[scope.needSelected];
				};
				scope.$watch('model', function(value) {
					scope.model = value;
					scope.needSelected = value === 'need';
				});
			}
		};
	}
);