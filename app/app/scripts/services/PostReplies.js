'use strict';

/**
 * @ngdoc service
 * @name hearth.services.PostReplies
 * @description
 */

angular.module('hearth.services').factory('PostReplies', [
	'$resource', 'appConfig',
	function($resource, appConfig) {
		return $resource(appConfig.apiPath + '/posts/:user_id/replies', {
			user_id: '@id'
		}, {
			add: {
				method: 'POST'
			}
		});
	}
]);