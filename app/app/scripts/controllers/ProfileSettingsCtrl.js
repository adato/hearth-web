'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileSettingsCtrl
 * @description
 * 
 * @deprecated
 */

angular.module('hearth.controllers').controller('ProfileSettingsCtrl', [
	'$scope', 'UsersService', 'LanguageSwitch', '$rootScope', '$route', 'Password', 'ChangePassword', '$timeout',
	function($scope, UsersService, LanguageSwitch, $rootScope, $route, Password, ChangePassword, $timeout) {
		$scope.loaded = true;
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

			if($scope.profileSettingsForm.oldPassLeave.$invalid) {
				res = false;
				$scope.showError.oldPassLeave = true;
			}

			return res;
		};

		$scope.processDeleteUserResult = function(res) {

			console.log(res);
			// window.location.reload("/app/");
		};

	 	$scope.sendDeleteRequest = function(data) {
	 		return function(resultValidation) {

				if(! validationResult) {
					return false;
				}

				User.remove({
					user_id: $rootScope.loggedUser._id,
					current_password: data.pass
				}, $scope.processDeleteUserResult);
	 		}
	 	}

		$scope.deleteAccount = function(data) {
			
			if(! $scope.validateDeleteAccount(data)) {
				return;
			}

			$scope.testOldPassword(data.pass, 'oldPassLeave', $scope.sendDeleteRequest(pass));

		};

		$scope.validateChangePasswordError = function(data) {
			var res = true;

			if($scope.profileSettingsForm.newPass.$invalid) {
				res = false;
				$scope.showError.newPass = true;
			}
				
			if($scope.profileSettingsForm.oldPass.$invalid) {
				res = false;
				$scope.showError.oldPass = true;
			}

			return res;
		};

		$scope.testOldPassword = function(pass, error, done) {
			
			if(pass == '') {
				return false;
			}

			Password.validate({user_id: $rootScope.loggedUser._id, password: pass}, function(res) {
				$scope.profileSettingsForm[error].$error.notValid = !res.valid;
				$scope.showError[error] = !res.valid;

				done && done(res.valid);
			});
		};

		$scope.processChangeResult = function(res) {

			if(res.ok) {
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

				if(! validationResult) {
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
			
			if(! $scope.validateChangePasswordError(pass)) {
				return;
			}
			
			// validate old pass
			$scope.testOldPassword(pass.old, 'oldPass', $scope.sendChangeRequest(pass));
		};

		$scope.init = function () {

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