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
				method: 'POST'
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
				url: $$config.apiPath + '/communities/:_id/ratings/possible_posts',
				params: {
					'communityId': '@_id'
				},
				method: 'GET',
			}
		});
	}
]);