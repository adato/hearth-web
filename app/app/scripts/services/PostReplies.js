'use strict';

/**
 * @ngdoc service
 * @name hearth.services.PostReplies
 * @description
 */

angular.module('hearth.services').factory('PostReplies', [
	'$resource',
	function($resource) {
		return $resource($$config.apiPath + '/posts/:userId/replies', {
			userId: '@id'
		}, {
			add: {
				method: 'POST'
			}
		});
	}
]);