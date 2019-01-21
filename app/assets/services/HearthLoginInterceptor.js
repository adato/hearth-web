'use strict';

/**
 * @ngdoc service
 * @name hearth.services.HearthLoginInterceptor
 * @description
 */

angular.module('hearth.services').factory('HearthLoginInterceptor', [
	'$q', '$location', '$rootScope', '$injector', 'UnauthReload',
	function($q, $location, $rootScope, $injector, UnauthReload) {

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
						UnauthReload.setLocation($location.path());

						// $location.path('/login');
						var $state = $injector.get('$state');
						return $state.go('login', {}, {
							location: 'replace'
						});
					}
				}
				return $q.reject(rejection);
			}
		};
	}
]);