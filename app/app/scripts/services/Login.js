'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Login
 * @description
 */

angular.module('hearth.services').factory('Login', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/login', {
			username: '@username',
			password: '@password'
		}, {
			send: {
				method: 'POST'
			},
		});
	}
]);