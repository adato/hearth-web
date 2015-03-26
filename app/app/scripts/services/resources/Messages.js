'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Messages
 * @description 
 */
 
angular.module('hearth.services').factory('Messages', [
	'$resource',
	
	function($resource) {
		return $resource($$config.apiPath + '/messages/', {
		}, {
			add: {
				method: 'POST'
			},
			get: {
				method: 'GET',
				isArray: true
			},
			reply: {
				method: 'POST',
				url: $$config.apiPath + '/messages/:_id'
			},
			getConversation: {
				url: $$config.apiPath + '/messages/:_id',
			},
			unreaded: {
				params: {
					state: 'unread'
				}
			},
			readed: {
				params: {
					state: 'read'
				}
			},
			unreadedCount: {
				params: {
					state: 'unread',
					output: 'count'
				}
			},
			readedCount: {
				params: {
					state: 'read',
					output: 'count'
				}
			}
		});
	}
]);