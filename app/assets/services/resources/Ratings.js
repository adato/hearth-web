'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Ratings
 * @description
 */

angular.module('hearth.services').factory('Ratings', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/ratings/:_id/', {
			_id: '@_id'
		}, {
			list: {
				url: $$config.apiPath + '/last_ratings/', 
				params: {
					page: '@page'
				},
				method: 'GET',
				isArray: true,
			},
			add: {
				method: 'POST',
				url: $$config.apiPath + '/ratings/:_id/comments',
				errorNotify: {
					code: 'PROFILE.RATING.NOTIFY.ERROR_RATING_REPLY'
				}
			}
		});
	}
]);