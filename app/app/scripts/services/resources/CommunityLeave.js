'use strict';

/**
 * @ngdoc service
 * @name hearth.services.CommunityLeave
 * @description 
 */

angular.module('hearth.services').factory('CommunityLeave', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/communities/:community_id/leave', {
			community_id: '@community_id'
		}, {
			leave: {
				method: 'DELETE',
				errorNotify: {
					code: 'NOTIFY.COMMUNITY_LEAVE_FAILED'
				}
			}
		});
	}
]);