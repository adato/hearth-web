'use strict';

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