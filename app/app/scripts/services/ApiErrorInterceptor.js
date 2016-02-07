'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ApiErrorInterceptor
 * @description
 */

angular.module('hearth.services').factory('ApiErrorInterceptor', [
	'$q', 'Notify',
	function($q, Notify) {

		return {
			response: function(response) {
				return response;
			},
			responseError: function(rejection) {
				Notify.onResourceError(rejection);

				return $q.reject(rejection);
			}
		};
	}
]);