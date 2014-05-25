'use strict';

/**
 * @ngdoc service
 * @name hearth.services.UserPosts
 * @description
 */
 
angular.module('hearth.services').factory('UserPosts', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/users/:userId/posts', {
			userId: '@id'
		}, {
			get: {
				method: 'GET',
				isArray: true,
				params: {
					limit: 10,
					offset: 0,
					sort: '-createdAt',
					r: Math.random()
				}
			}
		});
	}
]);