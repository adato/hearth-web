'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Info
 * @description
 */

angular.module('hearth.services').factory('Info', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/info', {}, {
			show: {
				method: 'GET'
			}
		});
	}
]);