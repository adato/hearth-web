'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ForgottenPasswordCtrl
 * @description 
 */
 
angular.module('hearth.controllers').controller('ForgottenPasswordCtrl', [
	'$scope', 'Auth', 'flash', '$location', '$translate', 'ResponseErrors',
	function($scope, Auth, flash, $location, $translate, ResponseErrors) {
		$scope.passwordResetRequest = {
			email: ''
		};
		$scope.errors = new ResponseErrors();
		return $scope.requestPasswordReset = function() {
			if (!$scope.forgottenPasswordForm.$valid) {
				return;
			}
			$scope.errors = new ResponseErrors();
			return Auth.requestPasswordReset($scope.passwordResetRequest.email).success(function() {
				$translate('FORGOTTEN_PASSWORD_EMAIL_SUCCESS');
				flash.success = 'FORGOTTEN_PASSWORD_EMAIL_SUCCESS';
				return $location.path('login');
			}).error(function(data, status) {
				return $scope.errors = new ResponseErrors({
					data: data,
					status: status
				});
			});
		};
	}
]);