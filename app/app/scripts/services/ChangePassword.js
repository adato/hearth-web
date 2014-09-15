'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ChangePassword
 * @description
 */

angular.module('hearth.services').factory('ChangePassword', [
	'$resource', 'appConfig',
	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/users/:user_id/change_password', {
			user_id: '@_id'
		}, {
			change: {
				method: 'PATCH',
			},
		});
	}
]);