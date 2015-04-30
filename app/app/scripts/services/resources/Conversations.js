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
			id: '@id',
		}, {
			add: {
				method: 'POST'
			},
			get: {
				method: 'GET',
			},
			getSilently: {
				method: 'GET',
		      	ignoreLoadingBar: true
			},
			leave: {
				url: $$config.apiPath + '/conversations/:id/leave',
				method: 'POST',
			},
			archive: {
				url: $$config.apiPath + '/conversations/:id/archive',
				method: 'POST',
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
				url: $$config.apiPath + '/conversations',
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