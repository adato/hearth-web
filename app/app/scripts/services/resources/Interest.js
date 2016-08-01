'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Interest
 * @description
 */

angular.module('hearth.services').factory('Interest', [
	'$resource',

	function($resource) {
		return $resource($$config.apiPath + '/interests/:search');
	}
]);