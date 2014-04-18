'use strict';

angular.module('hearth.controllers').controller('ChangePwdCtrl', [
	'$scope', 'flash', '$location', 'Auth',
	function($scope, flash, $location, Auth) {
		return $scope.save = function() {
			var loggedUser;
			if (!$scope.changePwdForm.$invalid) {
				$scope.errors = [];
				if ($scope.password1 !== $scope.password2) {
					return $scope.errors.push({
						param: 'password',
						msg: 'ERR_PASSWORDS_DONT_MATCH'
					});
				} else {
					loggedUser = Auth.getCredentials();
					return Auth.changePassword($scope.password1, function(data) {
						flash.success = 'PASSWORD_WAS_CHANGED';
						return $location.path('profile/' + loggedUser._id);
					}, function(res) {
						return $scope.errors.push('PASSWORD_CHANGE_FAILED');
					});
				}
			}
		};
	}
]);