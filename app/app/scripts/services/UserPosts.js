'use strict';

/**
 * @ngdoc service
 * @name hearth.services.UserPosts
 * @description
 */

angular.module('hearth.services').factory('UserPosts', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/users/:user_id/posts', {
			user_id: '@id'
		}, {
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