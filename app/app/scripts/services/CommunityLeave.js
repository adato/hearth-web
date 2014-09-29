'use strict';

/**
 * @ngdoc service
 * @name hearth.services.CommunityLeave
 * @description 
 */
 
angular.module('hearth.services').factory('CommunityLeave', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/communities/:community_id/leave', {
			community_id: '@community_id'
		}, {
			leave: {
				method: 'DELETE'
			}
		});
	}
]);