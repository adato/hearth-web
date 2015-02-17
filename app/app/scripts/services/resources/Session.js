'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Session
 * @description
 */

angular.module('hearth.services').factory('Session', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/session', {}, {
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