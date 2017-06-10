'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ResetPwdCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ResetPwdCtrl', [
	'$scope', 'Auth', '$location', 'Notify', '$state', 'User',
	function($scope, Auth, $location, Notify, $state, User) {

		$scope.token = true;
		$scope.sent = false;
		$scope.tokenVerified = false;

		$scope.data = {
			password: '',
			password2: '',
		};

		$scope.showError = {
			topError: false,
			password: false,
			password2: false,
			passwordMatch: false
		};

		$scope.validateData = function(data) {
			var invalid = false;

			if ($scope.resetPasswordForm.password.$invalid) {
				invalid = $scope.showError.password = true;
			}

			if ($scope.resetPasswordForm.password2.$invalid) {
				invalid = $scope.showError.password2 = true;
			} else if (data.password !== data.password2) {
				$scope.showError.password2 = true;
				invalid = $scope.showError.passwordMatch = true;
			}

			return !invalid;
		};


		/**
		 * This will reset users password, throw notify and refresh him on /login page
		 */
		$scope.resetPassword = function(data) {
			$scope.showError.topError = false;
			if (!$scope.validateData(data)) return false;

			User.resetPassword({
				token: $scope.token,
				password: data.password,
				confirm: data.password
			}, res => {
				Notify.addSingleTranslate('AUTH.NOTIFY.SUCCESS_RESET_PASSWORD', Notify.T_SUCCESS);
				$state.go('login');
			}, err => {
				// notify for this err is done by resource so there is no need to do it here again
				console.warn(err);
			});
		};

		/**
		 * Check on api if given token is valid
		 */
		$scope.validateToken = function(token) {

			// if token is not given, then show message
			if (!token) return $scope.tokenVerified = true;

			// if token is given, check api
			User.checkResetPasswordToken({ token }, res => {
				if (!res.ok) {
					// if not valid, set him to false
					$scope.token = false;
				}
				$scope.tokenVerified = true;
			});
		}

		// check token code if is valid
		$scope.init = function() {
			$scope.token = $location.search().hash;
			$scope.validateToken($scope.token);
		};

		$scope.init();
	}
]);