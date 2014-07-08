'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Post
 * @description
 */

angular.module('hearth.services').factory('Post', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/posts/:postId', {
			postId: '@id'
		}, {
			get: {
				method: 'GET',
				params: {
					limit: 15,
					offset: 0,
					sort: '-created_at'
				},
				isArray: true
			},
			query: {
				method: 'GET',
				isArray: true
			},
			add: {
				method: 'POST'
			},
			update: {
				method: 'PUT'
			},
			remove: {
				method: 'DELETE'
			},
			spam: {
				url: $$config.apiPath + '/posts/:postId/spam',
				method: 'PUT'
			}
		});
	}
]);