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
				nointercept: true,
			},
			query: {
				method: 'GET',
				url: $$config.apiPath + '/search/',
				params: {
					type: 'post'
				},
				nointercept: true,
			},
			suspend: {
				url: $$config.apiPath + '/posts/:postId/suspend',
				method: 'PUT'
			},
			resume: {
				url: $$config.apiPath + '/posts/:postId/resume',
				method: 'PUT'
			},
			prolong: {
				url: $$config.apiPath + '/posts/:postId/prolong',
				method: 'PUT'
			},
			mapQuery: {
				method: 'GET',
				url: $$config.apiPath + '/search/',
				params: {
					type: 'post'
				},
				isArray: true
			},
			add: {
				method: 'POST',
				headers: {'Content-Type': 'multipart/form-data'}
			},
			update: {
				method: 'PUT',
				headers: {'Content-Type': 'multipart/form-data'}
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