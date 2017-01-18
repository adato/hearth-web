'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Community
 * @description
 */

angular.module('hearth.services').factory('Community', [
	'$resource', 'LocationJsonDataTransform',

	function($resource, LocationJsonDataTransform) {
		return $resource($$config.apiPath + '/communities/:_id', {
			_id: "@_id"
		}, {
			get: {
				method: 'GET',
				params: {
					r: Math.random()
				},
				transformResponse: [LocationJsonDataTransform.getLocationJson]
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
				transformResponse: [LocationJsonDataTransform.getLocationJson.bind({
					prop: 'data'
				})]
			},
			edit: {
				method: 'PUT',
				errorNotify: {
					code: 'NOTIFY.COMMUNITY_UPDATE_FAILED'
				},
				transformRequest: [LocationJsonDataTransform.insertLocationJson]
			},
			uploadAvatar: {
				method: 'PATCH',
				headers: {
					'Content-Type': undefined
				},
				transformRequest: [function(image) {
					var fd = new FormData();
					fd.append('avatar[file]', image)
					return fd;
				}]
			},
			patch: {
				method: 'PATCH',
				errorNotify: {
					code: 'NOTIFY.COMMUNITY_UPDATE_FAILED'
				}
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
				transformRequest: [LocationJsonDataTransform.insertLocationJson]
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