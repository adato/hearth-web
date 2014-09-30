'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Tutorial
 * @description 
 */
angular.module('hearth.services').factory('Tutorial', [
	'$resource', 'appConfig',
	
	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/tutorial', {
		}, {
			getAll: {
				method: 'GET',
				isArray: true
			},
			get: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);