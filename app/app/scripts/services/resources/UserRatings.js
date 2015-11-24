'use strict';

/**
 * @ngdoc service
 * @name hearth.services.UserRatings
 * @description
 */

angular.module('hearth.services').factory('UserRatings', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/users/:user_id/ratings', {
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
					r: Math.random()
				}
			},
			received: {
				method: 'GET',
				isArray: true,
				params: {
					type: 'received',
					r: Math.random()
				}
			},
			given: {
				method: 'GET',
				isArray: true,
				params: {
					type: 'given',
				}
			},
			possiblePosts: {
				url: $$config.apiPath + '/users/:userId/ratings/possible_posts',
				params: {
					'userId': '@userId'
				},
				method: 'GET',
			}
		});
	}
]);