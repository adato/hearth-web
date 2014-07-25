'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ItemDetailResource
 * @description
 */

angular.module('hearth.services').factory('ItemDetailResource', [
	'$resource', 'appConfig',

	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/posts/:id', {
			communityId: '@id'
		}, {
			get: {
				method: 'GET'
			}
		});
	}
]);