'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Password
 * @description
 */

angular.module('hearth.services').factory('Password', [
	'$resource', 'appConfig',
	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/users/:user_id/validate_password', {
			user_id: '@_id'
		}, {
			validate: {
				method: 'GET'
			},
		});
	}
]);