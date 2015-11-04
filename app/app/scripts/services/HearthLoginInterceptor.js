'use strict';

/**
 * @ngdoc service
 * @name hearth.services.HearthLoginInterceptor
 * @description
 */

angular.module('hearth.services').factory('HearthLoginInterceptor', [
	'$q', '$location', '$timeout', '$rootScope',
	function($q, $location, $timeout, $rootScope) {

		return {
			request: function(config) {
				return config;
			},
			response: function(response) {
				return response;
			},
			responseError: function(rejection) {
				if (rejection.config && !rejection.config.nointercept) {

					if (rejection.status === 401) {
						$rootScope.loggedUser._id = false;
						$rootScope.loginRequired = true;
						$rootScope.user.loggedIn = false;
						$rootScope.referrerUrl = $location.path();
						$location.path('/login');
					}
				}
				return $q.reject(rejection);
			}
		};
	}
]);