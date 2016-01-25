'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Community
 * @description 
 */

angular.module('hearth.services').factory('Community', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/communities/:_id', {
			_id: "@_id"
		}, {
			get: {
				method: 'GET',
				params: {
					r: Math.random()
				}
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
				method: 'GET'
			},
			edit: {
				method: 'PUT',
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
				}
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