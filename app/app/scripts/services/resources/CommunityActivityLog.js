'use strict';

/**
 * @ngdoc service
 * @name hearth.services.CommunityActivityLog
 * @description
 */

angular.module('hearth.services').factory('CommunityActivityLog', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/communities/:communityId/activity_feed', {
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
