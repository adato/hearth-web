'use strict';


/**
 * @ngdoc controller
 * @name hearth.controllers.ResetPwdCtrl
 * @description 
 */
 
 angular.module('hearth.controllers').controller('ResetPwdCtrl', [
	'$scope', 'Auth', '$location',
	function($scope, Auth, $location) {
		$scope.hash = true;
		$scope.sent = false;

		$scope.data = {
			password: '',
			password2: '',
		};

		$scope.showError = {
			topError: false,
			password: false,
			password2: false,	
		};
		
		$scope.validateData = function(data) {
            var invalid = false;

            if ($scope.resetPasswordForm.password.$invalid) {
                invalid = $scope.showError.password = true;
            }

            if ($scope.resetPasswordForm.password2.$invalid) {
                invalid = $scope.showError.password2 = true;
            }

            if (!invalid && data.password !== data.password2) {
            	$scope.showError.password2 = true;
                invalid = $scope.resetPasswordForm.password2.$error.passwordDoesNotMatch = true;
            }
            
            return !invalid;
        };

		$scope.resetPassword = function(data) {
			$scope.showError.topError = false;
			if(!$scope.validateData(data))
				return false;

			function onSuccess() {
				$scope.sent = true;
			}

			function onError() {
				$scope.showError.topError = true;
			}

			return Auth.resetPassword($scope.hash, data.password, onSuccess, onError);
		};

		// check hash code if is valid
		$scope.init = function() {
			$scope.hash = $location.search().hash;

			if (!$scope.hash) {
				$scope.hash = false;
			} else {
				// validate link
				// $scope.hash = false;
			}
		};

		$scope.init();
		
	}
]);