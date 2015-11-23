'use strict';

/**
 * @ngdoc service
 * @name hearth.services.PostReplies
 * @description
 */

angular.module('hearth.services').factory('PostReplies', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/posts/:user_id/replies', {
			user_id: '@id'
		}, {
			add: {
				method: 'POST'
			}
		});
	}
]);
