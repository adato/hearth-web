'use strict';

angular.module('hearth.directives').directive('social', [

	function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: '../templates/social.html'
		};
	}
]);