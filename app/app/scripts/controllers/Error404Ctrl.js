'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ChangePwdCtrl
 * @description 
 */

angular.module('hearth.controllers').controller('Error404Ctrl', [
	'$scope', '$location', '$rootScope',
	function($scope, $location, $rootScope) {
		$scope.basePath = $rootScope.config.basePath;

		$scope.goToMarket = function() {
			$location.url('/');
		};
		$scope.goToFeedback = function() {
			$location.url('feedback');
		};
	}
]);