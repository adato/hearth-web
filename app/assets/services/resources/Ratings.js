'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Ratings
 * @description
 */

angular.module('hearth.services').factory('Ratings', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/ratings/:_id/comments', {
			_id: '@_id'
		}, {
			add: {
				method: 'POST',
				errorNotify: {
					code: 'PROFILE.RATING.NOTIFY.ERROR_RATING_REPLY'
				}
			}
		});
	}
]);