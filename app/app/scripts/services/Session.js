'use strict';

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