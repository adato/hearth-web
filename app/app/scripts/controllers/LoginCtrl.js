'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.LoginCtrl
 * @description
 */

angular.module('hearth.controllers').controller('LoginCtrl', [
	'$scope', '$location', '$routeParams', 'Auth', '$rootScope',
	function($scope, $location, $routeParams, Auth, $rootScope) {
		$scope.data = {
			username: '',
			password: ''
		};

		$scope.showError = {
			badCredentials: false
		};

		function processLoginResult(res) {
			if(res.data && res.data.ok === true) {
				window.location = window.location.pathname;
			} else {
				$scope.showError.badCredentials = true;
			}
		}

		$scope.validateLogin = function(data) {
			return data.username != '' && data.password != '';
		};

		// if login is opened in modal window, close him
		$scope.closeModal = function() {
			if($scope.closeThisDialog) $scope.closeThisDialog();
		};

		$scope.login = function(data) {
			$scope.showError.badCredentials = false;

			if(! $scope.validateLogin(data))
				return $scope.showError.badCredentials = true;

			Auth.login(data, processLoginResult);
		};

		$scope.init = function() {
			if (Auth.isLoggedIn()) {
				return $location.path($rootScope.referrerUrl || 'profile/' + Auth.getCredentials()._id);
			}
		};

		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);