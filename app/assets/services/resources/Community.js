'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Community
 * @description
 */

angular.module('hearth.services').factory('Community', [
	'$resource', 'LocationJsonDataTransform', 'plainResponseInterceptor',

	function($resource, LocationJsonDataTransform, plainResponseInterceptor) {
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
					code: 'COMMUNITY.NOTIFY.ERROR_UPDATE'
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
					code: 'COMMUNITY.NOTIFY.ERROR_UPDATE'
				}
			},
			remove: {
				method: 'DELETE',
				errorNotify: {
					code: 'COMMUNITY.NOTIFY.ERROR_DELETE_COMMUNITY'
				}
			},
			add: {
				method: 'POST',
				errorNotify: {
					code: 'COMMUNITY.NOTIFY.ERROR_CREATE'
				},
				transformRequest: [LocationJsonDataTransform.insertLocationJson]
			},
			suggested: {
				url: $$config.apiPath + '/related_communities',
				method: 'GET',
				isArray: true
			},
			getActivityLog: {
				method: 'GET',
				url: $$config.apiPath + '/communities/:communityId/activity_feed',
				isArray: true,
				interceptor: plainResponseInterceptor
			}
		});
	}
]);