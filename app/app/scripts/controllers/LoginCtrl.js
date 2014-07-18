'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.LoginCtrl
 * @description
 */

angular.module('hearth.controllers').controller('LoginCtrl', [
	'$scope', '$location', '$routeParams', '$translate', 'Auth', 'ResponseErrors', '$rootScope',
	function($scope, $location, $routeParams, $translate, Auth, ResponseErrors, $rootScope) {
		return Auth.init(function() {
			$scope.credentials = {
				username: '',
				password: ''
			};
			$scope.facebookLoginUrl = $$config.apiPath + '/auth/facebook';
			$scope.googleLoginUrl = $$config.apiPath + '/users/auth/google_oauth2';
			
			if (Auth.isLoggedIn()) {
				$location.path($rootScope.referrerUrl || 'profile/' + Auth.getCredentials()._id);
				return;
			}
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