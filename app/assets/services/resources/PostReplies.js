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
				method: 'POST',
				errorNotify: {
					code: 'POST.REPLY.NOTIFY.ERROR_SEND_REPLY',
					container: '.notify-reply-container'
				}
			}
		});
	}
]);