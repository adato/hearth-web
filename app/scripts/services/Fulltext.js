'use strict';

angular.module('hearth.services').factory('Fulltext', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/search', {}, {
			query: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);