'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileSettingsCtrl
 * @description
 *
 * @deprecated
 */

angular.module('hearth.controllers').controller('ProfileSettingsCtrl', [
	'$scope', 'UsersService', 'LanguageSwitch', '$rootScope', '$route', 'Password', 'ChangePassword', '$timeout', 'User',
	function($scope, UsersService, LanguageSwitch, $rootScope, $route, Password, ChangePassword, $timeout, User) {
		$scope.loaded = true;
		$scope.changeSubmitted = false;
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

		$scope.validateDeleteAccount = function(data) {
			var res = true;

			if ($scope.profileDeleteForm.oldPassLeave.$invalid) {
				res = false;
				$scope.showError.oldPassLeave = true;
			}

			return res;
		};

		$scope.processDeleteUserResult = function(res) {

			if (res.ok) {
				alert("Váš účet byl smazán :-(");
				window.location.replace("/app/");
			} else {

				alert("Při mazání účtu došlo k chybě.");
			}
		};

		$scope.sendDeleteRequest = function(data) {
			return function(validationResult) {

				if (!validationResult) {
					return false;
				}

				User.remove({
					user_id: $rootScope.loggedUser._id,
					current_password: data.pass,
					reason: data.reason
				}, $scope.processDeleteUserResult);
			}
		}

		$scope.deleteAccount = function(data) {

			if (!$scope.validateDeleteAccount(data)) {
				return;
			}

			$scope.testOldPassword(data.pass, 'profileDeleteForm', 'oldPassLeave', $scope.sendDeleteRequest(data.pass));
		};

		$scope.validateChangePasswordError = function(data) {
			var res = true;

			if ($scope.profileSettingsForm.newPass.$invalid) {
				res = false;
				$scope.showError.newPass = true;
			}

			if ($scope.profileSettingsForm.oldPass.$invalid) {
				res = false;
				$scope.showError.oldPass = true;
			}

			return res;
		};

		$scope.testOldPassword = function(pass, form, error, done) {

			if (pass == '') {
				return false;
			}

			Password.validate({
				user_id: $rootScope.loggedUser._id,
				password: pass
			}, function(res) {
				$scope[form][error].$error.notValid = !res.valid;
				$scope.showError[error] = !res.valid;

				done && done(res.valid);
			});
		};

		$scope.processChangeResult = function(res) {
			$scope.changeSubmitted = false;
			
			if (res.ok) {
				$scope.pass.old = '';
				$scope.pass.changed = '';

				$timeout(function() {
					$scope.showError.oldPass = false;
					$scope.showError.newPass = false;
				});
				alert("heslo bylo změněno.. A tady bude nějaká pretty notifikace");
			} else {

				alert("Při měnění hesla došlo k chybě.");
			}
		};

		$scope.sendChangeRequest = function(pass) {
			return function(validationResult) {

				if (!validationResult) {
					return false;
				}

				ChangePassword.change({
					user_id: $rootScope.loggedUser._id,
					password: pass.newPass,
					password_confirmation: pass.newPass,
					current_password: pass.old
				}, $scope.processChangeResult);
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

			$scope.lang = LanguageSwitch.uses();
		};

		$scope.switchLang = function(lang) {

			LanguageSwitch.swicthTo(lang);
			window.location.reload();
		};


		$rootScope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);