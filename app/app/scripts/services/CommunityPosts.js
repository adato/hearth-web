'use strict';

/**
 * @ngdoc service
 * @name hearth.services.CommunityPosts
 * @description 
 */
 
angular.module('hearth.services').factory('CommunityPosts', [
	'$resource',
	
	function($resource) {
		return $resource($$config.apiPath + '/communities/:communityId/posts', {
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