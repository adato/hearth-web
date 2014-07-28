'use strict';

/**
 * @ngdoc service
 * @name hearth.services.FolloweePosts
 * @description
 */

angular.module('hearth.services').factory('FolloweePosts', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/users/:user_id/followees/posts', {
			user_id: '@user_id'
		}, {
			query: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);