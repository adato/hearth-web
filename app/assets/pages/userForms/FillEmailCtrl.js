'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.FillEmailCtrl
 * @description
 */

angular.module('hearth.controllers').controller('FillEmailCtrl', [
	'$scope', 'ResponseErrors', 'Email', 'Notify', '$stateParams', 'User',
	function($scope, ResponseErrors, Email, Notify, $stateParams, User) {
		$scope.twitter_token = false;
		$scope.data = {
			email: '',
			language: preferredLanguage
		};
		$scope.showError = {
			email: false
		};
		$scope.sending = false;
		$scope.errors = new ResponseErrors();

		$scope.testEmailExists = function(email, form, inputName, cbValid, cbInvalid) {
			// dont check when email is blank
			if (!email) return false;

			// Check if email is in our DB
			$scope.sending = true;
			Email.exists({
				email: email
			}, function(res) {
				$scope[form][inputName].$error.used = true;
				return cbInvalid && cbInvalid('email does exist');
			}, function(res) {
				$scope[form][inputName].$error.used = false;
				return cbValid && cbValid();
			});
		};

		$scope.validateEmail = function(form, cbValid, cbInvalid) {

			// if email is invalid
			if ($scope.fillEmailForm.email.length) {
				cbInvalid && cbInvalid('email invalid');
			} else {
				// else test if email exists
				$scope.testEmailExists(form.email, 'fillEmailForm', 'email', cbValid, cbInvalid);
			}
		};

		$scope.fillEmail = function() {
			if ($scope.sending)
				return false;

			// is email valid?
			$scope.validateEmail($scope.data, function() {
				// valid email, ready to go on ...

				return User.completeEmailForRegistration($scope.data, res => {
					$scope.sending = false;
					Notify.addSingleTranslate('NOTIFY.COMPLETE_TWITTER_REGISTRATION_SUCCESS', Notify.T_SUCCESS);
					$scope.hideForm();

				}, function(err, status) {
					$scope.sending = false;
					$scope.errors = new ResponseErrors({
						status: status,
						data: err
					});

					if ($scope.errors.email) {

						$scope.fillEmailForm.email.$error.used = true;
						$scope.showError.email = true;
					}
				});
			}, function(res) {
				// invalid email, discard
				$scope.sending = false;
			});
		};

		$scope.hideForm = function() {
			$(".register-login-form").slideUp('slow', function() {});
			$(".register-successful").slideDown('slow', function() {});
		};


		$scope.data.email_token = $stateParams.token;
	}
]);