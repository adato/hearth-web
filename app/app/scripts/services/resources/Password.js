'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Password
 * @description
 */

angular.module('hearth.services').factory('Password', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/users/:user_id/validate_password', {
			user_id: '@_id'
		}, {
			validate: {
				method: 'GET'
			},
		});
	}
]);
