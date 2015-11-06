'use strict';

/**
 * @ngdoc service
 * @name hearth.services.User
 * @description
 */

angular.module('hearth.services').factory('User', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/users/:_id', {
			_id: '@_id'
		}, {
			add: {
				method: 'POST'
			},
			get: {
				method: 'GET'
			},
			getReplies: {
				url: $$config.apiPath + '/replies',
				method: 'GET'
			},
			getPosts: {
				url: $$config.apiPath + '/users/:user_id/posts',
				method: 'GET'
			},
			getConnections: {
				url: $$config.apiPath + '/users/connections',
				method: 'GET'
			},
			edit: {
				method: 'PUT'
			},
			remove: {
				method: 'DELETE'
			},
			setClosedFilter: {
				url: $$config.apiPath + '/close_filter',
				method: 'POST'
			}
		});
	}
]);