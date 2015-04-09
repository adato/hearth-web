'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.LocalizationPage
 * @description
 */

angular.module('hearth.controllers').controller('LocalizationPage', [
	'$scope', '$location', '$timeout',
	function($scope, $location, $timeout) {
		$scope.pageName = $location.path().slice(1);
		
		$timeout(function() {
			$scope.show = true;
		});
	}
]);