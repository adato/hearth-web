'use strict';

angular.module('hearth.services').factory('CommunityMembers', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/communities/:communityId/members/:memberId', {
			communityId: '@communityId',
			memberId: '@memberId'
		}, {
			add: {
				method: 'POST'
			},
			show: {
				method: 'GET'
			},
			remove: {
				method: 'DELETE'
			},
			query: {
				method: 'GET',
				isArray: true,
				params: {
					sort: '-createdAt',
					r: Math.random()
				}
			}
		});
	}
]);