'use strict';

/**
 * @ngdoc service
 * @name hearth.services.UsersActivityLog
 * @description
 */

angular.module('hearth.services').factory('UsersActivityLog', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/users/:user_id/activity_feed', {
			user_id: '@id'
		}, {
			get: {
				method: 'GET',
				isArray: true,
				params: {
					r: Math.random()
				}
			}
		});
	}
]);