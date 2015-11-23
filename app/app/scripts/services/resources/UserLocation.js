'use strict';

/**
 * @ngdoc service
 * @name hearth.services.UserLocation
 * @description
 */

angular.module('hearth.services').factory('UserLocation', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/users/:user_id/location', {
			user_id: '@id'
		}, {
			add: {
				method: 'POST'
			},
			remove: {
				method: 'DELETE'
			}
		});
	}
]);
