'use strict';

/**
 * @ngdoc service
 * @name hearth.services.plainResponseInterceptor
 * @description returns the full response including headers and stuff
 */
angular.module('hearth.services').factory('plainResponseInterceptor', ['$q', function ($q) {

  return {
		response: response => {
			return response || $q.when(response);
		},
		responseError: rejection => {
			return $q.reject(rejection);
		}
	};

}]);