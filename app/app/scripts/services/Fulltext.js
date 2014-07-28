'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Fulltext
 * @description
 */

angular.module('hearth.services').factory('Fulltext', [
	'$resource', 'appConfig',
	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/search', {}, {
			query: {
				method: 'GET',
				params: {
					limit: 15
				}
			},
			stats: {
				method: 'GET',
				params: {
					counters: true
				}
			}
		});
	}
]);