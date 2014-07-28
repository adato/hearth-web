'use strict';

/**
 * @ngdoc service
 * @name hearth.services.FolloweeSearch
 * @description
 */

angular.module('hearth.services').factory('FolloweeSearch', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/users/:user_id/followees/search', {
			user_id: '@user_id'
		}, {
			query: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);