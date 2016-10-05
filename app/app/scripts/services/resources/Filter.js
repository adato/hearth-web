'use strict';

/**
 * @ngdoc service
 * @name hearth.services.FilterResource
 * @description
 */

angular.module('hearth.services').factory('FilterResource', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/filter', {}, {
			patch: {
				method: 'PATCH'
			}
		});
	}
]);