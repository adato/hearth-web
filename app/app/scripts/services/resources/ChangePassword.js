'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ChangePassword
 * @description
 */

angular.module('hearth.services').factory('ChangePassword', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/users/:user_id/change_password', {
			user_id: '@_id'
		}, {
			change: {
				method: 'PATCH',
			},
		});
	}
]);