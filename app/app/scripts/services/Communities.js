'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Communities
 * @description 
 */
 
angular.module('hearth.services').factory('Communities', [
	'$resource',
	
	function($resource) {
		return $resource($$config.apiPath + '/communities', {
			communityId: '@_id'
		}, {
			random: {
				method: 'GET',
				isArray: true,
				params: {
					r: Math.random()
				}
			}
		});
	}
]);