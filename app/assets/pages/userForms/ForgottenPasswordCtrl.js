'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ForgottenPasswordCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ForgottenPasswordCtrl', [
	'$scope', 'ResponseErrors', 'Email', 'Notify', '$state',
	function($scope, ResponseErrors, Email, Notify, $state) {
		var resendingEmail = false;
		var invalidEmail = null;

		$scope.data = {
			email: ''
		};
		$scope.showError = {
			email: false,
			inactiveAccount: false
		};

		$scope.errors = new ResponseErrors();

		function testEmailExists(email, form, inputName, cb) {
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
			if (resendingEmail) return;
			resendingEmail = true;

			User.resendActivationEmail(invalidEmail, res => {
				resendingEmail = false;

				if (res.ok === true) {
					Notify.addSingleTranslate('NOTIFY.REACTIVATING_EMAIL_WAS_SENT', Notify.T_SUCCESS);
					$scope.showError.inactiveAccount = false;
				}
			}, err => {
				resendingEmail = false;
			});
		};

		$scope.validateEmail = function(form, cb) {
			$scope.showError.email = true;
			// if form is not valid, return false
			if (!$scope.resetPasswordForm.email.$$success.email) {
				cb && cb(false);
			} else {
				// else test if email exists
				testEmailExists(form.email, 'resetPasswordForm', 'email', cb);
			}
		};

		$scope.resetPassword = function() {
			$.each($scope.showError, function(key) {
				$scope.showError[key] = false;
			});

			// is email valid?
			$scope.validateEmail($scope.data, function(res) {
				if (!res) return false;
				if ($scope.sending) return false;
				$scope.sending = true;

				return User.requestPasswordReset({
					email: $scope.data.email
				}, res => {
					$scope.sending = false;

					if (res.error == 'account_not_confirmed') {
						$scope.showError.inactiveAccount = true;
						invalidEmail = $scope.data.email;
					} else {
						Notify.addSingleTranslate('NOTIFY.RESET_PASSWORD_SUCCESS', Notify.T_SUCCESS);
						$state.go('login');
					}
				}, err => {
					$scope.sending = false;
				});
			});
		};
	}
]);