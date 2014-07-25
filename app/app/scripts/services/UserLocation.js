'use strict';

/**
 * @ngdoc service
 * @name hearth.services.UserLocation
 * @description
 */

angular.module('hearth.services').factory('UserLocation', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/users/:user_id/location', {
			user_id: '@id'
		}, {
			add: {
				method: 'POST'
			},
			remove: {
				method: 'DELETE'
			}
		});
	}
]);