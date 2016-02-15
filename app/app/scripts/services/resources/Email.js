'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Feedback
 * @description
 */

angular.module('hearth.services').factory('Email', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/users/check_email', {
			email: '@email'
		}, {
			exists: {
				url: $$config.apiPath + '/users/check_email?email=:email',
				method: 'GET'
			},
		});
	}
]);