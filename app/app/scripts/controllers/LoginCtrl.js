'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.LoginCtrl
 * @description
 */

angular.module('hearth.controllers').controller('LoginCtrl', [
	'$scope', '$location', '$routeParams', 'Auth', '$rootScope', 'Login',
	function($scope, $location, $routeParams, Auth, $rootScope, Login) {
		$scope.data = {
			username: '',
			password: ''
		};

		$scope.showError = {
			badCredentials: false
		};

		function processLoginResult(res) {
			$scope.showError.badCredentials = true;
		}

		$scope.validateLogin = function(data) {
			console.log(data);
			return data.username != '' && data.password != '';
		};

		$scope.sendLogin = function(data) {

			Login.send(data, function(res) {

				console.log(res);
			}, processLoginResult);
		};

		$scope.login = function() {
			$scope.showError.badCredentials = false;

			if(! $scope.validateLogin($scope.data)) {
				$scope.showError.badCredentials = true;
			} else {
				$scope.sendLogin($scope.login);
			}
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