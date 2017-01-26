'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ChangePwdCtrl
 * @description 
 */

angular.module('hearth.controllers').controller('Error404Ctrl', [
	'$scope', '$location', '$rootScope', '$window',
	function($scope, $location, $rootScope, $window) {
		$scope.basePath = $rootScope.config.basePath;

		if ($window.Rollbar) {
			$window.Rollbar.error("Error 404 invoked", {
				page: $location.url()
			});
		}

		$scope.goToMarket = function() {
			$location.url('/');
		};
		$scope.goToFeedback = function() {
			$location.url('feedback');
		};
	}
]);