'use strict';

/**
 * @ngdoc service
 * @name hearth.services.UserPosts
 * @description
 */

angular.module('hearth.services').factory('UserPosts', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/users/:user_id/posts', {
			user_id: '@id'
		}, {
			get: {
				method: 'GET',
				isArray: true,
				params: {
					limit: 10,
					offset: 0,
					r: Math.random()
				}
			}
		});
	}
]);