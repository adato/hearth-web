'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ConfirmEmailCtrl
 * @description 
 */

angular.module('hearth.controllers').controller('TokenLoginCtrl', [
	'$scope', '$location', 'Auth', 'Notify', '$stateParams',
	function($scope, $location, Auth, Notify, $stateParams) {
		var errorPattern = /error\=400/g; // test for error string present
		if (errorPattern.test($location.path())) {
			return $location.path('/login?showNoOauthAccountWarning');
		}

		if ($stateParams.token) {
			Auth.setToken($stateParams.token);
			window.location = $$config.appUrl;
			return true;
		}
		return $location.path('/');
	}
]);