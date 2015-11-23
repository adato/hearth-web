'use strict';

/**
 * @ngdoc service
 * @name hearth.services.FolloweeSearch
 * @description
 */

angular.module('hearth.services').factory('FolloweeSearch', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/users/:user_id/followees/search', {
			user_id: '@user_id'
		}, {
			query: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);
