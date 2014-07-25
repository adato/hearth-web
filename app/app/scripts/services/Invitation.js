'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Invitation
 * @description
 */

angular.module('hearth.services').factory('Invitation', [
	'$resource', 'appConfig',
	
	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/invitation', {}, {
			add: {
				method: 'POST'
			}
		});
	}
]);