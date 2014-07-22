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