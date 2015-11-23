'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Keywords
 * @description
 */

angular.module('hearth.services').factory('Keywords', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/keywords/:keyword', {}, {
			get: {
				method: 'GET',
				isArray: true
			}
		});
	}
]);
