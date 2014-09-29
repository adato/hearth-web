'use strict';

/**
 * @ngdoc service
 * @name hearth.services.CommunityDelegateAdmin
 * @description 
 */
 
angular.module('hearth.services').factory('CommunityDelegateAdmin', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/communities/:community_id/delegate_admin', {
			community_id: '@community_id'
		}, {
			delegate: {
				method: 'PUT' // parametr new_admin_id = userId
			}
		});
	}
]);