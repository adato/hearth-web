'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Followees
 * @description 
 */
 
angular.module('hearth.services').factory('Followees', [
	'$resource', 'appConfig',
	
	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/users/:user_id/followees/', {
			user_id: '@user_id',
			r: Math.random()
		}, {
			query: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);