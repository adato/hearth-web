'use strict';

/**
 * @ngdoc service
 * @name hearth.services.UserRatings
 * @description
 */

angular.module('hearth.services').factory('UserRatings', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/users/:user_id/ratings', {
			user_id: '@id'
		}, {
			add: {
				method: 'POST',
				errorNotify: {
					code: 'PROFILE.NOTIFY.ERROR_USER_RATING_FAILED',
					container: '.rating-notify-box'
				}
			},
			get: {
				method: 'GET',
				isArray: true,
				params: {
					limit: 10,
					offset: 0,
					r: Math.random()
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
			possiblePosts: {
				url: $$config.apiPath + '/users/:userId/ratings/possible_posts',
				method: 'GET',
				params: {
					userId: '@userId'
				}
			},
			activePosts: {
				url: $$config.apiPath + '/users/:userId/posts',
				method: 'GET',
				params: {
					userId: '@userId',
					state: 'active'
				}
			}
		});
	}
]);