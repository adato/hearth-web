'use strict';

/**
 * @ngdoc service
 * @name hearth.services.CommunityPosts
 * @description 
 */
 
angular.module('hearth.services').factory('CommunityPosts', [
	'$resource', 'appConfig',
	
	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/communities/:communityId/posts', {
			communityId: '@id'
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