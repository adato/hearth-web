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
					need: 'offer',
					offer: 'need'
				};

				$('div', element).click(function() {
					scope.$apply(function() {

						scope.ngModel = value[scope.ngModel];
					});
				});
			}
		};
	}
);