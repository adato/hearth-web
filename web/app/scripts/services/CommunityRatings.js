'use strict';

angular.module('hearth.services').factory('CommunityRatings', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/communities/:communityId/ratings', {
			communityId: '@id'
		}, {
			add: {
				method: 'POST'
			},
			get: {
				method: 'GET',
				isArray: true,
				params: {
					sort: '-createdAt',
					r: Math.random()
				}
			}
		});
	}
]);