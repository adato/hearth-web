'use strict';


/**
 * @ngdoc controller
 * @name hearth.controllers.ResetPwdCtrl
 * @description 
 */
 
 angular.module('hearth.controllers').controller('ResetPwdCtrl', [
	'$scope', 'Auth', '$location', 'flash',
	function($scope, Auth, $location, flash) {
		$scope.validLink = true;
		$scope.sent = false;

		// check hash code if is valid
		$scope.init = function() {
			var search;
			$scope.hash = $location.search().hash
			if (!$scope.hash) {
				$scope.validLink = false;
			} else {
				// check link
			}
		};


		return $scope.resetPwd = function() {
			var onError, onSuccess;
			$scope.error = false;
			if (!$scope.resetPwdForm.$invalid) {
				if ($scope.password1 !== $scope.password2) {
					$scope.error = 'ERR_PASSWORDS_DONT_MATCH';
					return $scope.error;
				} else {
					onSuccess = function() {
						flash.success = 'PASSWORD_RESET_SUCCESS';
						return $location.path('login');
					};
					onError = function(data) {
						$scope.error = data;
						return $scope.error;
					};
					return Auth.resetPassword($scope.hash, $scope.password1, onSuccess, onError);
				}
			}
		};
	}
]).directive('pwCheck', function() {
	return {
		require: 'ngModel',
		link: function(scope, elem, attrs, ctrl) {
			var firstPassword = '#' + attrs.pwCheck;
			$(elem).on('keyup', function() {
				scope.$apply(function() {
					var v = elem.val() === $(firstPassword).val();
					ctrl.$setValidity('pwcheck', v);
				});
			});
		}
	};
});