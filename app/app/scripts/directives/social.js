'use strict';

/**
 * @ngdoc directive
 * @name social
 * @description Displays social networks links
 * @restrict E
 */
angular.module('hearth.directives').directive('social', [

	function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				url: '='
			},
			templateUrl: 'templates/social.html'
		};
	}
]);