'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Followers
 * @description
 */

angular.module('hearth.services').factory('Followers', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/users/:user_id/followers/:followerId', {
			user_id: '@user_id',
			followerId: '@followerId'
		}, {
			add: {
				method: 'POST',
				errorNotify: {
					code: 'NOTIFY.ADD_FOLLOWER_FAILED'
				}
			},
			show: {
				method: 'GET'
			},
			remove: {
				method: 'DELETE',
				errorNotify: {
					code: 'NOTIFY.REMOVE_FOLLOWER_FAILED'
				}
			},
			query: {
				method: 'GET',
				isArray: true,
				params: {
					r: Math.random()
				}
			}
		});
	}
]);