'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Fulltext
 * @description
 */

angular.module('hearth.services').factory('Fulltext', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/search', {}, {
			query: {
				method: 'GET'
			}
		});
	}
]);