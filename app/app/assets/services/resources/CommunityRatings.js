'use strict';

/**
 * @ngdoc service
 * @name hearth.services.CommunityRatings
 * @description
 */

angular.module('hearth.services').factory('CommunityRatings', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/communities/:communityId/ratings', {
			communityId: '@id'
		}, {
			add: {
				method: 'POST',
				errorNotify: {
					code: 'NOTIFY.COMMUNITY_RATING_ADD_FAILED',
					container: '.rating-notify-box'
				}
			},
			received: {
				method: 'GET',
				isArray: true,
				params: {
					type: 'received',
					r: Math.random()
				}
			},
			given: {
				method: 'GET',
				isArray: true,
				params: {
					type: 'given',
				}
			},
			get: {
				method: 'GET',
				isArray: true,
				params: {
					r: Math.random()
				}
			},
			possiblePosts: {
				url: $$config.apiPath + '/communities/:communityId/ratings/possible_posts',
				method: 'GET',
				params: {
					communityId: '@communityId'
				}
			},
			activePosts: {
				url: $$config.apiPath + '/communities/:communityId/posts',
				method: 'GET',
				params: {
					communityId: '@communityId',
					state: 'active',
					not_related: 'true'
				}
			}
		});
	}
]);