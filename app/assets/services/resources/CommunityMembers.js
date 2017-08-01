'use strict';

/**
 * @ngdoc service
 * @name hearth.services.CommunityMembers
 * @description 
 */

angular.module('hearth.services').factory('CommunityMembers', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/communities/:communityId/members/:memberId', {
			communityId: '@communityId',
			memberId: '@memberId'
		}, {
			add: {
				method: 'POST',
				errorNotify: {
					code: 'COMMUNITY.NOTIFY.ERROR_APPROVE_APPLICATION'
				}
			},
			show: {
				method: 'GET'
			},
			remove: {
				method: 'DELETE',
				errorNotify: {
					code: 'COMMUNITY.NOTIFY.ERROR_KICK_USER'
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