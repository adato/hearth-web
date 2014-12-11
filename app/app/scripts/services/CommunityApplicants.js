'use strict';

/**
 * @ngdoc service
 * @name hearth.services.CommunityApplicants
 * @description
 */

angular.module('hearth.services').factory('CommunityApplicants', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/communities/:communityId/applicants/:applicantId', {
			communityId: '@communityId',
			applicantId: '@applicantId'
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
					r: Math.random()
				}
			}
		});
	}
]);