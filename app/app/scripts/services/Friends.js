'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Friends
 * @description
 */

angular.module('hearth.services').factory('Friends', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/users/:user_id/friends/:friendId', {
			user_id: '@user_id',
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