'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Info
 * @description
 */

angular.module('hearth.services').factory('Info', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/info', {}, {
			show: {
				method: 'GET'
			}
		});
	}
]);