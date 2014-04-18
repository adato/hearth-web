'use strict';

angular.module('hearth.services').factory('CommunityMemberships', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/users/:userId/communities', {
			userId: '@id'
		}, {
			get: {
				method: 'GET',
				params: {
					r: Math.random()
				}
			},
			query: {
				method: 'GET',
				isArray: true,
				params: {
					r: Math.random()
				}
			}
		});
	}
]);