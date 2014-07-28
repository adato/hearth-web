'use strict';

/**
 * @ngdoc service
 * @name hearth.services.UserRatings
 * @description
 */

angular.module('hearth.services').factory('UserRatings', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/users/:user_id/ratings', {
			user_id: '@id'
		}, {
			add: {
				method: 'POST'
			},
			get: {
				method: 'GET',
				isArray: true,
				params: {
					limit: 10,
					offset: 0,
					sort: '-created_at',
					r: Math.random()
				}
			}
		});
	}
]);