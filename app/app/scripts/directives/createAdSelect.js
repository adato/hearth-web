'use strict';

angular.module('hearth.directives').directive('createAdSelect', [

	function() {
		return {
			restrict: 'AE',
			replace: true,
			scope: true,
			templateUrl: 'templates/createAdSelect.html',
			link: function() {}
		};
	}
]);