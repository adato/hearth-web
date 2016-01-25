'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.LoginCtrl
 * @description
 */

angular.module('hearth.controllers').controller('LoginCtrl', [
	'$scope', '$location', 'Auth', '$rootScope', 'UnauthReload', 'LanguageSwitch', '$auth', 'Notify',
	function($scope, $location, Auth, $rootScope, UnauthReload, LanguageSwitch, $auth, Notify) {
		var resendingEmail = false;
		var invalidEmail = null;
		$scope.data = {
			username: '',
			password: ''
		};

		$scope.loginError = false;
		$scope.showError = {
			badCredentials: false,
			inactiveAccount: false
		};

		$scope.twitterAuthUrl = Auth.getTwitterAuthUrl();

		function processLoginResult(res) {
			if (res.data && res.data.ok === true) {
				Auth.processLoginResponse(res.data);
			} else {
				showErrorCredentials(res.data);
			}
		}

		$scope.oauth = function(provider) {
			$auth.authenticate(provider, {
				language: preferredLanguage
			}).then(function(response) {
				if (response.status == 200)
					processLoginResult(response);
				else
					$scope.loginError = true;
			});
		};

		$scope.resendActivationEmail = function() {
			if (resendingEmail) return;
			resendingEmail = true;

			Auth.resendActivationEmail(invalidEmail, function(res) {
				resendingEmail = false;

				if (res.data && res.data.ok === true) {
					Notify.addSingleTranslate('NOTIFY.REACTIVATING_EMAIL_WAS_SENT', Notify.T_SUCCESS);
					$scope.showError.inactiveAccount = false;
				}
			}, function() {
				resendingEmail = false;
			});
		};

		function showErrorCredentials(res) {
			if (res && res.error && res.error == 'account_not_confirmed') {
				invalidEmail = $scope.data.username;
				$scope.showError.inactiveAccount = true;
				$scope.showError.badCredentials = false;
			} else {

				// focus to password field
				$(".login_password").focus();

				// show top error message
				$scope.showError.badCredentials = true;
			}

			// set blank password - try it again
			$scope.showMsgOnlyLogged = false;
			$scope.data.password = '';
		}

		$scope.validateLogin = function(data) {
			return data.username != '' && data.password != '';
		};

		// if login is opened in modal window, close him
		$scope.closeModal = function() {
			if ($scope.closeThisDialog) $scope.closeThisDialog();
		};

		$scope.login = function(data) {
			$scope.loginError = false;
			// $scope.showError.badCredentials = false;
			if (!$scope.validateLogin(data))
				return showErrorCredentials();

			Auth.login(data, processLoginResult);
		};

		$scope.init = function() {

			var params = $location.search();
			if (params.error)
				$scope.loginError = true;

			if (Auth.isLoggedIn()) {
				return $location.path($rootScope.referrerUrl || '/');
			}

			$(".login_name").focus();
		};

		$scope.setLoginRequired = function() {
			$scope.showMsgOnlyLogged = true;
			$rootScope.loginRequired = false;
			$scope.loginError = false;
		};

		if ($rootScope.loginRequired) {
			$scope.setLoginRequired();
		} else {
			$scope.$on('loginRequired', $scope.setLoginRequired);
		}

		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);