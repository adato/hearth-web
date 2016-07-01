'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Community
 * @description
 */

angular.module('hearth.services').factory('Community', [
	'$resource', '$window', 'ProfileUtils',

	function($resource, $window, ProfileUtils) {
		return $resource($$config.apiPath + '/communities/:_id', {
			_id: "@_id"
		}, {
			get: {
				method: 'GET',
				params: {
					r: Math.random()
				},
				transformResponse: [ProfileUtils.single.getLocationJson]
			},
			query: {
				method: 'GET',
				isArray: true,
				params: {
					r: Math.random()
				}
			},
			getPosts: {
				url: $$config.apiPath + '/communities/:communityId/posts',
				method: 'GET',
				transformResponse: [ProfileUtils.single.getLocationJson.bind({
					prop: 'data'
				})]
			},
			edit: {
				method: 'PUT',
				errorNotify: {
					code: 'NOTIFY.COMMUNITY_UPDATE_FAILED'
				},
				transformRequest: [ProfileUtils.single.insertLocationJson]
			},
			remove: {
				method: 'DELETE',
				errorNotify: {
					code: 'NOTIFY.COMMUNITY_DELETE_FAILED'
				}
			},
			add: {
				method: 'POST',
				errorNotify: {
					code: 'NOTIFY.COMMUNITY_CREATE_FAILED'
				},
				transformRequest: [ProfileUtils.single.insertLocationJson]
			},
			suggested: {
				url: $$config.apiPath + '/related_communities',
				method: 'GET',
				isArray: true,
				params: {
					r: Math.random()
				}
			}
		});
	}
]);