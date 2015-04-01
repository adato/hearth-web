'use strict';

/**
 * @ngdoc service
 * @name hearth.services.User
 * @description
 */

angular.module('hearth.services').factory('User', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/users/:_id', {}, {
			add: {
				method: 'POST'
			},
			get: {
				method: 'GET'
			},
			getPosts: {
				url: $$config.apiPath + '/users/:user_id/posts',
				method: 'GET'
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

