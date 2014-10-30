'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ChangePwdCtrl
 * @description 
 */

angular.module('hearth.controllers').controller('Error404Ctrl', [
	'$scope', '$location',
	function($scope, $location) {
		
		$scope.goToMarket = function() {
			$location.url('/');
		};

		// make some analytics action?
	}
]);