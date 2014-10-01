'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Tutorial
 * @description 
 */
angular.module('hearth.services').factory('Tutorial', [
	'$resource', 'appConfig',
	
	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/users/:user_id/tutorial', {
			user_id: '@user_id',
		}, {
			getAll: {
				method: 'GET',
				isArray: true,
				params: {
					all: 1
				}
			},
			get: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);