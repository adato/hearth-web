'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Presign
 * @description
 *    function to use to get presigned url for amazon direct upload
 *    resolves a json with
 *     - url to upload images to
 *     - presigned time-limited key that allows the upload
 *     - other information required by aws enabling the upload
 */

angular.module('hearth.services').factory('Presign', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/presigned');
	}
]);