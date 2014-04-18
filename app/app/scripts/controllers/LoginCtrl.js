'use strict';

angular.module('hearth.controllers').controller('LoginCtrl', [
	'$scope', '$location', '$routeParams', '$translate', 'Auth', 'ResponseErrors', '$rootScope',
	function($scope, $location, $routeParams, $translate, Auth, ResponseErrors, $rootScope) {
		return Auth.init(function() {
			if (Auth.isLoggedIn()) {
				$location.path($rootScope.referrerUrl || 'profile/' + Auth.getCredentials()._id);
				return;
			}
			$scope.credentials = {
				username: '',
				password: ''
			};
			$translate('ERR_NOT_AUTHN');
			$translate('ERR_NOT_AUTHZ');
			$scope.errors = new ResponseErrors($routeParams.reason ? {
				status: 400,
				data: {
					name: 'ValidationError',
					message: 'ERR_' + $routeParams.reason.toUpperCase().replace('-', '_')
				}
			} : null);
			return $scope.errors;
		});
	}
]);