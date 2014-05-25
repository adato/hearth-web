'use strict';

/**
 * @ngdoc service
 * @name hearth.services.FolloweeSearch
 * @description
 */

angular.module('hearth.services').factory('FolloweeSearch', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/users/:userId/followees/search', {
			userId: '@userId'
		}, {
			query: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);