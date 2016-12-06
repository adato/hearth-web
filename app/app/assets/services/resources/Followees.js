'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Followees
 * @description 
 */

angular.module('hearth.services').factory('Followees', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/users/:user_id/followees/', {
			user_id: '@user_id',
			r: Math.random()
		}, {
			query: {
				method: 'GET',
				isArray: true
			},
			fetchCommonFollowees: {
				url: $$config.apiPath + '/users/:user_id/followees/:logged_user_id/users',
				user_id: '@user_id',
				logged_user_id: '@logged_user_id',
				method: 'GET',
				isArray: true
			},
			fetchCommonCommunities: {
				url: $$config.apiPath + '/users/:user_id/followees/:logged_user_id/communities',
				user_id: '@user_id',
				logged_user_id: '@logged_user_id',
				method: 'GET',
				isArray: true
			},
			fetchCommunityFollowees: {
				url: $$config.apiPath + '/communities/:community_id/followees/:logged_user_id/users',
				community_id: '@community_id',
				logged_user_id: '@logged_user_id',
				method: 'GET',
				isArray: true
			}
		});
	}
]);