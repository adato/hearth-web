'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ForgottenPasswordCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ForgottenPasswordCtrl', [
	'$scope', 'Auth', '$location', 'ResponseErrors', 'Email', 'Notify',
	function($scope, Auth, $location, ResponseErrors, Email, Notify) {
		var invalidEmail = null;
		$scope.data = {
			email: ''
		};
		$scope.showError = {
			email: false,
			inactiveAccount: false
		};

		$scope.errors = new ResponseErrors();

		$scope.testEmailExists = function(email, form, inputName, cb) {
			$scope[form][inputName].$error.unknown = false;
			// dont check when email is blank
			if (!email) return false;

			// Check if email is in our DB
			Email.exists({
				email: email
			}, function(res) {
				if (!res.ok) {
					// show error when email does not exist
					$scope.showError.email = true;
					$scope[form][inputName].$error.unknown = true;
				}
				// call callbeck
				cb && cb(res.ok);
			}, function(res) {
				$scope.showError.email = true;
				$scope[form][inputName].$error.unknown = true;
				cb && cb(false);
			});
		};

		$scope.resendActivationEmail = function() {
			Auth.resendActivationEmail(invalidEmail, function(res) {
				if (res.data && res.data.ok === true) {
					Notify.addSingleTranslate('NOTIFY.REACTIVATING_EMAIL_WAS_SENT', Notify.T_SUCCESS);
					$scope.showError.inactiveAccount = false;
				}
			});
		};

		$scope.validateEmail = function(form, cb) {
			$scope.showError.email = true;
			// if form is not valid, return false
			if (!$scope.resetPasswordForm.email.$$success.email) {
				cb && cb(false);
			} else {
				// else test if email exists
				$scope.testEmailExists(form.email, 'resetPasswordForm', 'email', cb);
			}
		};

		$scope.resetPassword = function() {
			$.each($scope.showError, function(key) {
				$scope.showError[key] = false;
			});

			// is email valid?
			$scope.validateEmail($scope.data, function(res) {
				if (!res) return false;

				if ($scope.sending)
					return false;
				$scope.sending = true;

				return Auth.requestPasswordReset($scope.data.email).success(function(res) {
					$scope.sending = false;

					if (res.ok == false && res.error && res.error == 'account_not_confirmed') {
						$scope.showError.inactiveAccount = true;
						invalidEmail = $scope.data.email;
					} else {
						Notify.addSingleTranslate('NOTIFY.RESET_PASSWORD_SUCCESS', Notify.T_SUCCESS);
						$location.url("/login");
					}
				}).error(function(data, status) {
					$scope.sending = false;
				});
			});
		};
	}
]);