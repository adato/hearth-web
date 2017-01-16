'use strict';

/**
 * @ngdoc service
 * @name hearth.services.CommunityApplicants
 * @description
 */

angular.module('hearth.services').factory('CommunityApplicants', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/communities/:communityId/applicants/:applicantId', {
			communityId: '@communityId',
			applicantId: '@applicantId'
		}, {
			add: {
				method: 'POST',
				errorNotify: {
					code: 'NOTIFY.COMMUNITY_APPLY_FAILED'
				}
			},
			show: {
				method: 'GET'
			},
			remove: {
				method: 'DELETE',
				errorNotify: {
					code: 'NOTIFY.COMMUNITY_REJECT_FAILED'
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