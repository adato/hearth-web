'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.hearth-footer
 * @description adds footer to page
 * @restrict A
 */
angular.module('hearth.directives').directive('hearthFooter', [
	'$rootScope',
	function($rootScope) {
		return {
			restrict: 'E',
			scope: true,
			templateUrl: 'assets/components/footer/footer.html',
			link: function($scope, element) {

				// default
				$scope.showNewsletterForm = false;
			}
		};
	}
]);