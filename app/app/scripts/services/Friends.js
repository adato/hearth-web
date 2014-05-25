'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Friends
 * @description
 */

angular.module('hearth.services').factory('Friends', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/users/:userId/friends/:friendId', {
			userId: '@userId',
			friendId: '@friendId',
			r: Math.random()
		}, {
			show: {
				method: 'GET'
			},
			query: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);