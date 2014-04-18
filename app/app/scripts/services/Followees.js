'use strict';

angular.module('hearth.services').factory('Followees', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/users/:userId/followees/', {
			userId: '@userId',
			r: Math.random()
		}, {
			query: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);