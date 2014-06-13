'use strict';

/**
 * @ngdoc service
 * @name hearth.services.AdDetailResource
 * @description
 */

angular.module('hearth.services').factory('AdDetailResource', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/posts/:id', {
			communityId: '@id'
		}, {
			get: {
				method: 'GET'
			}
		});
	}
]);