'use strict';

angular.module('hearth.directives').directive('social', [

	function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				url: '='
			},
			templateUrl: '../templates/social.html'
		};
	}
]);