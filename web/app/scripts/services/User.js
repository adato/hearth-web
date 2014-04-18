'use strict';

angular.module('hearth.services').factory('User', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/users/:userId', {
			userId: '@_id'
		}, {
			add: {
				method: 'POST'
			},
			get: {
				method: 'GET',
				params: {
					r: Math.random()
				}
			},
			edit: {
				method: 'PUT'
			},
			remove: {
				method: 'DELETE'
			}
		});
	}
]);