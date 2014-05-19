'use strict';

angular.module('hearth.controllers').controller('ResetPwdCtrl', [
	'$scope', 'Auth', '$location', 'flash',
	function($scope, Auth, $location, flash) {
		$scope.init = function() {
			var search;
			search = $location.search();
			$scope.hash = search.hash;
			if (!$scope.hash) {
				flash.error = 'MISSING_PASSWORD_RESET_HASH';
				return $location.path('login');
			}
		};
		return $scope.resetPwd = function() {
			var onError, onSuccess;
			$scope.error = false;
			if (!$scope.resetPwdForm.$invalid) {
				if ($scope.password1 !== $scope.password2) {
					return $scope.error = 'ERR_PASSWORDS_DONT_MATCH';
				} else {
					onSuccess = function(data) {
						flash.success = 'PASSWORD_RESET_SUCCESS';
						return $location.path('login');
					};
					onError = function(data) {
						return $scope.error = data;
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