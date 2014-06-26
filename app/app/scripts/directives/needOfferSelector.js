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
				ngModel: '=',
				community: '=',
			},
			templateUrl: 'templates/needOfferSelector.html',
			link: function(scope, element) {
				var value = {
					false: 'offer',
					true: 'need'
				};
				scope.needSelected = false;

				scope.toggleNeed = function() {
					scope.needSelected = !scope.needSelected;
					scope.ngModel = value[scope.needSelected];
				};
			}
		};
	}
);