'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileSettingsCtrl
 * @description
 *
 * @deprecated
 */

angular.module('hearth.controllers').controller('ProfileSettingsCtrl', [
	'$scope', 'LanguageSwitch', '$rootScope', 'Password', 'ChangePassword', '$timeout', 'User', 'Notify', 'UnauthReload',
	function($scope, LanguageSwitch, $rootScope, Password, ChangePassword, $timeout, User, Notify, UnauthReload) {
		$scope.loaded = true;
		$scope.lang = false; // used in view
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

		/**
		 * Validate delete account form
		 */
		$scope.validateDeleteAccount = function(data) {
			var invalid = false;

			if ($scope.profileDeleteForm.oldPassLeave.$error.notValid) {
				invalid = $scope.showError.oldPassLeave = true;
			}
			return !invalid;
		};

		/**
		 * When user delete request fails
		 */
		$scope.processDeleteUserResultError = function(res) {
			$scope.processDeleteUserResult(res.data);
		};

		/**
		 * Proces result of delete user request
		 */
		$scope.processDeleteUserResult = function(res) {
			$rootScope.globalLoading = false;

			// if ok, reload browser and show notify
			if (res.ok) {

				Notify.addTranslateAfterRefresh('NOTIFY.ACCOUNT_DELETE_SUCCESS', Notify.T_SUCCESS);
				window.location.replace("/app/");
			} else if (res.reason == 'community admin') {
				// when user has community, show notify - hack for problem with view handling
				setTimeout(function() {
					return Notify.addTranslate('NOTIFY.ACCOUNT_DELETE_FAILED_COMMUNITY', Notify.T_ERROR, '.notify-container-delete-user');
				}, 1000);
			} else {
				// when there is general error
				Notify.addSingleTranslate('NOTIFY.ACCOUNT_DELETE_FAILED', Notify.T_ERROR);
			}
		};

		/**
		 * Send request to delete user
		 */
		$scope.sendDeleteRequest = function(data) {
			return function(validationResult) {
				if (!validationResult) return false;

				// serialize
				var out = {
					_id: $rootScope.loggedUser._id,
					current_password: data.pass,
					reason: data.reason
				};

				$rootScope.globalLoading = true;

				// send request
				User.remove(out, $scope.processDeleteUserResult, $scope.processDeleteUserResultError);
			}
		};

		/**
		 * Delete account
		 */
		$scope.deleteAccount = function(data) {

			if (!$scope.validateDeleteAccount(data)) return false;
			// test password first
			$scope.testOldPassword(data.pass, 'profileDeleteForm', 'oldPassLeave', $scope.sendDeleteRequest(data));
		};

		/**
		 * Validate old password
		 */
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

		/**
		 * Process result of change password request
		 */
		$scope.processChangeResult = function(res) {
			$scope.changeSubmitted = false;
			$rootScope.globalLoading = false;

			if (res.ok) {
				$scope.pass.old = '';
				$scope.pass.changed = '';
				$scope.profileSettingsForm.$setPristine();
				$scope.profileSettingsForm.$setValidity();

				$timeout(function() {
					$scope.showError.oldPass = false;
					$scope.showError.newPass = false;
				});

				Notify.addSingleTranslate('NOTIFY.PASS_CHANGE_SUCCES', Notify.T_SUCCESS);
			} else {

				Notify.addSingleTranslate('NOTIFY.PASS_CHANGE_FAILED', Notify.T_ERROR);
			}
		};

		/**
		 * Send request for password change
		 */
		$scope.sendChangeRequest = function(pass) {
			return function(validationResult) {
				if (!validationResult || $scope.changeSubmitted) return false;
				$scope.changeSubmitted = true;

				$rootScope.globalLoading = true;
				ChangePassword.change({
					password: pass.changed,
					password_confirmation: pass.changed,
					current_password: pass.old
				}, $scope.processChangeResult, $scope.processChangeResult);
			}
		};

		/**
		 * Validate password change form
		 */
		$scope.validateChangePasswordError = function(data) {
			var invalid = false;

			if ($scope.profileSettingsForm.newPass.$invalid) {
				invalid = $scope.showError.newPass = true;
			}

			// async test
			// if ($scope.profileSettingsForm.oldPass.$invalid) {
			// 	invalid = $scope.showError.oldPass = true;
			// }
			return !invalid;
		};

		/**
		 * Change password and validate old pass
		 */
		$scope.changePassword = function(pass) {
			if (!$scope.validateChangePasswordError(pass)) return false;

			// validate old pass
			$scope.testOldPassword(pass.old, 'profileSettingsForm', 'oldPass', $scope.sendChangeRequest(pass));
		};

		$scope.saveNotificationSettings = function(settings) {
			var data = {
				_id: $rootScope.loggedUser._id,
				settings: settings,
			};

			User.edit(data, function(res) {
				$rootScope.user.settings = settings;
				Notify.addSingleTranslate('NOTIFY.EMAIL_NOTIFY_CONFIG_SUCCESS', Notify.T_SUCCESS);
			}, function(err) {
				Notify.addSingleTranslate('NOTIFY.EMAIL_NOTIFY_CONFIG_FAILED', Notify.T_ERROR);
			});

		};

		$scope.init = function() {
			// for authorized only
			UnauthReload.check();
			$scope.notify = $rootScope.user.settings;
		};

		// switch language to given lang code
		$scope.switchLang = function(lang) {
			LanguageSwitch.swicthTo(lang);
		};

		$rootScope.$watch("language", function(lang) {
			$scope.lang = lang;
		});

		$rootScope.$on('initLanguageSuccess', $scope.init);
		$rootScope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);
