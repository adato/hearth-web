'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Followees
 * @description 
 */
 
angular.module('hearth.services').factory('Followees', [
	'$resource',
	
	function($resource) {
		return $resource($$config.apiPath + '/users/:user_id/followees/', {
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