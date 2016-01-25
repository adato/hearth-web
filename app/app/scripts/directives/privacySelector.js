'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.privacySelector
 * @description Allows user to select privacy model for particular element
 * @restrict E
 */

angular.module('hearth.directives').directive('privacySelector', [
	'$rootScope', '$timeout',
	function($rootScope, $timeout) {
		return {
			restrict: 'AE',
			replace: true,
			scope: {
				remove: '=remove',
				ngDisabled: '=',
			},
			templateUrl: 'templates/directives/privacySelector.html',
			link: function($scope) {}
		};
	}
]);