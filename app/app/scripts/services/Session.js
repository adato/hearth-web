'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Session
 * @description
 */

angular.module('hearth.services').factory('Session', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/session', {}, {
			show: {
				method: 'GET',
				params: {
					r: Math.random()
				}
			},
			update: {
				method: 'PUT'
			}
		});
	}
]);