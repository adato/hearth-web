'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ItemDetailResource
 * @description
 */

angular.module('hearth.services').factory('ItemDetailResource', [
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
