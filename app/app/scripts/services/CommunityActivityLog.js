'use strict';

/**
 * @ngdoc service
 * @name hearth.services.CommunityActivityLog
 * @description
 */

angular.module('hearth.services').factory('CommunityActivityLog', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/communities/:communityId/activity_feed', {
			communityId: '@communityId'
		}, {
			get: {
				method: 'GET',
				isArray: true,
				params: {
					r: Math.random()
				}
			}
		});
	}
]);