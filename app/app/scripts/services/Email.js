'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Feedback
 * @description
 */

angular.module('hearth.services').factory('Email', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/users/check_email', {
			email: '@email'
		}, {
			exists: {
				method: 'GET',
			},
		});
	}
]);