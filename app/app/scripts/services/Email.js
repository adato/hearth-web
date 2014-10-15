'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Feedback
 * @description
 */

angular.module('hearth.services').factory('Email', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/users/exists_email', {
			email: '@email'
		}, {
			exists: {
				method: 'GET',
			},
		});
	}
]);