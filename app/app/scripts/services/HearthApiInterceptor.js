'use strict';

/**
 * @ngdoc service
 * @name hearth.services.HearthApiInterceptor
 * @description
 */

angular.module('hearth.services').factory('HearthApiInterceptor', [
	'$q', 'Notify',
	function($q, Notify) {

		return {
			response: function(response) {
				return response;
			},
			responseError: function(rejection) {
				switch (rejection.status) {
					case 401:
						Notify.addSingleTranslate('NOTIFY.API_401', Notify.T_INFO);
						break;
					case 422:
						Notify.addSingleTranslate('NOTIFY.API_422', Notify.T_WARNING);
						break;
					case 500:
						Notify.addSingleTranslate('NOTIFY.API_500', Notify.T_ERROR);
						break;
				}

				return $q.reject(rejection);
			}
		};
	}
]);