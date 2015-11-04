'use strict';

/**
 * @ngdoc service
 * @name hearth.services.CommunityMemberships
 * @description 
 */

angular.module('hearth.services').factory('CommunityMemberships', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/users/:user_id/communities', {
			user_id: '@id'
		}, {
			get: {
				method: 'GET',
				isArray: true,
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
			}
		});
	}
]);