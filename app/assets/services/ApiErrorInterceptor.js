'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ApiErrorInterceptor
 * @description
 */

angular.module('hearth.services').factory('ApiErrorInterceptor', [
	'$q', 'Notify', '$window',
	function($q, Notify, $window) {

		return {
			response: function(response) {
				return response;
			},
			responseError: function(rejection) {
				if (rejection.status === 403 && rejection.data && rejection.data.error === "IP blocked") {
					$window.location.href = '/access-denied.html';
					return $q.reject(rejection);
				}
				Notify.onResourceError(rejection);
				return $q.reject(rejection);
			}
		};
	}
]);