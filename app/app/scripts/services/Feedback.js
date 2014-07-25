'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Feedback
 * @description
 */

angular.module('hearth.services').factory('Feedback', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/feedback', {}, {
			add: {
				method: 'POST'
			}
		});
	}
]);