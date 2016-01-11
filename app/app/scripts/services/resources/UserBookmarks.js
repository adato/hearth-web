'use strict';

/**
 * @ngdoc service
 * @name hearth.services.UserRatings
 * @description
 */

angular.module('hearth.services').factory('UserBookmarks', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/posts/:postId/bookmarks', {
			'postId': '@postId'
		}, {
			query: {
				url: $$config.apiPath + '/bookmarks',
				method: 'GET',
				isArray: true,
				params: {
					limit: 10,
					offset: 0,
					r: Math.random()
				}
			},
			add: {
				method: 'POST',
			},
			remove: {
				method: 'DELETE',
			}
		});
	}
]);