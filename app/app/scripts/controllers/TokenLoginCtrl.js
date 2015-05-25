'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ConfirmEmailCtrl
 * @description 
 */
 
angular.module('hearth.controllers').controller('TokenLoginCtrl', [
	'$scope', '$location', 'Auth', 'Notify', '$routeParams',
	function($scope, $location, Auth, Notify, $routeParams) {
		if($routeParams.token) {
			Auth.setToken($routeParams.token);
			window.location = window.location.pathname;
			return true;
		}
		return $location.path($$config.basePath);
	}
]);