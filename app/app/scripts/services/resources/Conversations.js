'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Messages
 * @description 
 */
 
angular.module('hearth.services').factory('Conversations', [
	'$resource',
	
	function($resource) {
		return $resource($$config.apiPath + '/conversations/:id', {
		}, {
			add: {
				method: 'POST'
			},
			get: {
				method: 'GET',
			},
			getCounters: {
				url: $$config.apiPath + '/conversations/counter',
				method: 'GET',
		      	ignoreLoadingBar: true
			},
			getMessages: {
				url: $$config.apiPath + '/conversations/:id/messages',
				method: 'GET',
		      	ignoreLoadingBar: true
			},
			getParticipants: {
				url: $$config.apiPath + '/conversations/:id/users',
				method: 'GET'
			},
			reply: {
				method: 'POST',
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