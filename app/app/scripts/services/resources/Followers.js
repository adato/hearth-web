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
					r: Math.random()
				}
			}
		});
	}
]);