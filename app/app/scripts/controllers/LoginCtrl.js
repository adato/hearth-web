'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.LoginCtrl
 * @description
 */

angular.module('hearth.controllers').controller('LoginCtrl', [
	'$scope', '$location', '$routeParams', 'Auth', '$rootScope', 'UnauthReload', 'LanguageSwitch', '$auth',
	function($scope, $location, $routeParams, Auth, $rootScope, UnauthReload, LanguageSwitch, $auth) {
		$scope.data = {
			username: '',
			password: ''
		};

		$scope.loginError = false;
		$scope.showError = {
			badCredentials: false
		};


	    $scope.oauth = function(provider) {
      		$auth.authenticate(provider).then(function(response) {
         		if(response.status == 200)
	         		processLoginResult(response);
	         	else
	         		$scope.loginError = true;
      		});
	    };


		function showErrorCredentials() {
			
			// focus to password field
			$(".login_password").focus();

			// show top error message
			$scope.showError.badCredentials = true;

			// set blank password - try it again
			$scope.data.password = '';
		}
		
		function processLoginResult(res) {
			if(res.data && res.data.ok === true) {

				// when user logged, use his language configured on API
				if(res.data.language)
					LanguageSwitch.setCookie(res.data.language);

				if(res.data.api_token) {
					Auth.setToken(res.data.api_token);
				}

				window.location = window.location.pathname;
			} else {
				showErrorCredentials();
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
			$scope.loginError = false;
			// $scope.showError.badCredentials = false;
			if(! $scope.validateLogin(data))
				return showErrorCredentials();

			Auth.login(data, processLoginResult);
		};

		$scope.init = function() {

			var params = $location.search();
			if(params.error)
				$scope.loginError = true;
			
			if (Auth.isLoggedIn()) {
				return $location.path( $rootScope.referrerUrl || '/');
			}

			$(".login_name").focus();
		};

		$scope.setLoginRequired = function() {
			$scope.showMsgOnlyLogged = true;
			$rootScope.loginRequired = false;
			$scope.loginError = false;
		};

		if($rootScope.loginRequired) {
			$scope.setLoginRequired();
		} else {
			$scope.$on('loginRequired', $scope.setLoginRequired);
		}

		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);