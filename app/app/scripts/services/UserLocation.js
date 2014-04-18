'use strict';

angular.module('hearth.services').factory('UserLocation', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/users/:userId/location', {
			userId: '@id'
		}, {
			add: {
				method: 'POST'
			},
			remove: {
				method: 'DELETE'
			}
		});
	}
]);