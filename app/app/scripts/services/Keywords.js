'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Keywords
 * @description
 */

angular.module('hearth.services').factory('Keywords', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/keywords/:keyword', {}, {
			get: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);