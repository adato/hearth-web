'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Post
 * @description
 */

angular.module('hearth.services').factory('Post', [
	'$resource', 'appConfig',
	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/posts/:postId', {
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
				url: appConfig.apiPath + '/posts/:postId/spam',
				method: 'PUT'
			}
		});
	}
]);