'use strict';

angular.module('hearth.services').factory('Keywords', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/keywords', {}, {
			query: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);