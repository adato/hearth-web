'use strict';

/**
 * @ngdoc service
 * @name hearth.services.User
 * @description
 */

angular.module('hearth.services').factory('User', [
	'$resource', 'appConfig',
	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/users/:user_id', {
			user_id: '@_id'
		}, {
			add: {
				method: 'POST'
			},
			get: {
				method: 'GET'
			},
			edit: {
				method: 'PUT'
			},
			remove: {
				method: 'DELETE'
			}
		});
	}
]);