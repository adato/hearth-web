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
			query: {
				method: 'GET',
				url: appConfig.apiPath + '/search/',
				params: {
					type: 'post'
				},
			},
			suspend: {
				url: appConfig.apiPath + '/posts/:postId/suspend',
				method: 'PUT'
			},
			resume: {
				url: appConfig.apiPath + '/posts/:postId/resume',
				method: 'PUT'
			},
			prolong: {
				url: appConfig.apiPath + '/posts/:postId/prolong',
				method: 'PUT'
			},
			mapQuery: {
				method: 'GET',
				url: appConfig.apiPath + '/search/',
				params: {
					type: 'post'
				},
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