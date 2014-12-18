'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileSettingsCtrl
 * @description
 *
 * @deprecated
 */

angular.module('hearth.controllers').controller('ProfileSettingsCtrl', [
	'$scope', 'UsersService', 'LanguageSwitch', '$rootScope', '$route', 'Password', 'ChangePassword', '$timeout', 'User', 'Notify', 'UnauthReload',
	function($scope, UsersService, LanguageSwitch, $rootScope, $route, Password, ChangePassword, $timeout, User, Notify, UnauthReload) {
		$scope.loaded = true;
		$scope.lang = false;
		$scope.changeSubmitted = false;
		$scope.languages = LanguageSwitch.getLanguages();
		$scope.pass = {
			old: '',
			changed: ''
		};
		$scope.leave = {
			reason: '',
			pass: ''
		};
		$scope.showError = {
			oldPassLeave: false,
			oldPass: false,
			newPass: false
		};
		$scope.d = new Date();

		$scope.validateDeleteAccount = function(data) {
			var res = true;

			if ($scope.profileDeleteForm.oldPassLeave.$invalid) {
				res = false;
				$scope.showError.oldPassLeave = true;
			}

			return res;
		};

		$scope.processDeleteUserResultError = function(res) {
			$scope.processDeleteUserResult(res.data);
		};

		$scope.processDeleteUserResult = function(res) {
			$rootScope.globalLoading = false;

			if (res.ok) {

				Notify.addTranslateAfterRefresh('NOTIFY.ACCOUNT_DELETE_SUCCESS', Notify.T_SUCCESS);
				window.location.replace("/app/");
			} else if( res.reason == 'community admin' ) {
				setTimeout(function() {
					return Notify.addTranslate('NOTIFY.ACCOUNT_DELETE_FAILED_COMMUNITY', Notify.T_ERROR, '.notify-container-delete-user');
				}, 1000);
			} else {
				Notify.addSingleTranslate('NOTIFY.ACCOUNT_DELETE_FAILED', Notify.T_ERROR);
			}
		};

		$scope.sendDeleteRequest = function(data) {
			return function(validationResult) {

				if (!validationResult) {
					return false;
				}
				var out = {
					user_id: $rootScope.loggedUser._id,
					current_password: data.pass,
					reason: data.reason
				};

				$rootScope.globalLoading = true;

				User.remove(out, $scope.processDeleteUserResult, $scope.processDeleteUserResultError);
			}
		};

		$scope.deleteAccount = function(data) {

			if (!$scope.validateDeleteAccount(data)) {
				return;
			}

			$scope.testOldPassword(data.pass, 'profileDeleteForm', 'oldPassLeave', $scope.sendDeleteRequest(data));
		};

		$scope.validateChangePasswordError = function(data) {
			var invalid = false;

			if ($scope.profileSettingsForm.newPass.$invalid) {
				invalid = $scope.showError.newPass = true;
			}

			if ($scope.profileSettingsForm.oldPass.$invalid) {
				invalid = $scope.showError.oldPass = true;
			}
			return !invalid;
		};

		$scope.testOldPassword = function(pass, form, error, done) {

			if (!pass) {
				$scope[form][error].$error.notValid = false;
				return false;
			}

			Password.validate({
				user_id: $rootScope.loggedUser._id,
				password: pass
			}, function(res) {
				$scope[form][error].$error.notValid = !res.ok;
				$scope.showError[error] = !res.ok;

				done && done(res.ok);
			}, function() {
				$scope[form][error].$error.notValid = true;
				$scope.showError[error] = true;
				done && done(false);
			});
		};

		$scope.processChangeResult = function(res) {
			$scope.changeSubmitted = false;
			$rootScope.globalLoading = false;

			if (res.ok) {
				$scope.pass.old = '';
				$scope.pass.changed = '';

				$timeout(function() {
					$scope.showError.oldPass = false;
					$scope.showError.newPass = false;
				});
				
				Notify.addSingleTranslate('NOTIFY.PASS_CHANGE_SUCCES', Notify.T_SUCCESS);
			} else {

				Notify.addSingleTranslate('NOTIFY.PASS_CHANGE_FAILED', Notify.T_ERROR);
			}
		};

		$scope.sendChangeRequest = function(pass) {
			return function(validationResult) {

				if (!validationResult) {
					return false;
				}

				$rootScope.globalLoading = true;
				ChangePassword.change({
					user_id: $rootScope.loggedUser._id,
					password: pass.changed,
					password_confirmation: pass.changed,
					current_password: pass.old
				}, $scope.processChangeResult, $scope.processChangeResult);
			}
		};

		$scope.changePassword = function(pass) {
			
			if (!$scope.validateChangePasswordError(pass)) {
				return;
			}
			
			if($scope.changeSubmitted) {
				return false;
			}
			$scope.changeSubmitted = true;

			// validate old pass
			$scope.testOldPassword(pass.old, 'profileSettingsForm', 'oldPass', $scope.sendChangeRequest(pass));
		};

		$scope.init = function() {

			UnauthReload.check();
			LanguageSwitch.uses().code
		};

		$scope.switchLang = function(lang) {
			LanguageSwitch.swicthTo(lang);
		};


		$rootScope.$on('initLanguageSuccess', $scope.init);
		$rootScope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);