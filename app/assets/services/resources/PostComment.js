'use strict';

/**
 * @ngdoc service
 * @name hearth.services.PostComment
 * @description
 */

angular.module('hearth.services').factory('PostComment', [
	'$resource', 'LocationJsonDataTransform',
	function($resource, LocationJsonDataTransform) {
		return $resource($$config.apiPath + '/posts/:postId/comments/:commentId', {
            postId: '@postId',
            commentId: '@commentId',
		}, {
			hideComment: {
				method: 'PUT',
				url: $$config.apiPath + '/posts/:postId/comments/:commentId/hide'
			},
			unhideComment: {
				method: 'PUT',
				url: $$config.apiPath + '/posts/:postId/comments/:commentId/unhide'
			},


		});
	}
]);
