'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Followers
 * @description
 */

angular.module('hearth.services').factory('Followers', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/users/:userId/followers/:followerId', {
			userId: '@userId',
			followerId: '@followerId'
		}, {
			add: {
				method: 'POST'
			},
			show: {
				method: 'GET'
			},
			remove: {
				method: 'DELETE'
			},
			query: {
				method: 'GET',
				isArray: true,
				params: {
					sort: '-createdAt',
					r: Math.random()
				}
			}
		});
	}
]);