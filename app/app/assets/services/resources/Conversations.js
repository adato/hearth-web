'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Messages
 * @description
 */

angular.module('hearth.services').factory('Conversations', [
	'$resource', 'ConversationDataTransform',

	function($resource, ConversationDataTransform) {
		return $resource($$config.apiPath + '/conversations/:id', {
			id: '@id',
		}, {
			add: {
				method: 'POST',
				headers: {
					'Content-Type': undefined
				},
				transformRequest: function(data) {
					var fd = new FormData();
					angular.forEach(data, function(key, value) {
						if (value === 'attachments_attributes') {
							if (!(key instanceof Array)) key = [key];
							for (var i = 0, l = key.length; i < l; i++) {
								fd.append('attachments_attributes[][multipart]', key[i]);
							}
						} else if (value === 'participant_ids') {
							angular.forEach(key, function(id, index) {
								fd.append('participant_ids[]', id);
							});
						} else {
							fd.append(value, key);
						}
					});
					return fd;
				},
				errorNotify: {
					code: 'NOTIFY.MESSAGE_SEND_FAILED',
					container: '.notify-new-message-container',
				}
			},
			get: {
				method: 'GET',
				transformResponse: [ConversationDataTransform.enrichWithTitles]
			},
			leave: {
				url: $$config.apiPath + '/conversations/:id/leave',
				method: 'POST',
				errorNotify: {
					code: 'NOTIFY.CONVERSATION_LEAVE_FAILED'
				}
			},
			archive: {
				url: $$config.apiPath + '/conversations/:id/archive',
				method: 'POST',
				errorNotify: {
					code: 'NOTIFY.CONVERSATION_ARCHIVE_FAILED'
				}
			},
			delete: {
				method: 'DELETE',
				errorNotify: {
					code: 'NOTIFY.CONVERSATION_DELETE_FAILED'
				}
			},
			getCounters: {
				url: $$config.apiPath + '/conversations/counter',
				method: 'GET'
			},
			getMessages: {
				url: $$config.apiPath + '/conversations/:id/messages',
				method: 'GET'
			},
			getParticipants: {
				url: $$config.apiPath + '/conversations/:id/users',
				method: 'GET'
			},
			addParticipants: {
				url: $$config.apiPath + '/conversations/:conversation_id/participants?:ids',
				method: 'POST',
				ignoreLoadingBar: true,
				params: {
					conversation_id: '@conversation_id',
					'id[]': '@ids'
				}
			},
			reply: {
				url: $$config.apiPath + '/conversations',
				method: 'POST',
				headers: {
					'Content-Type': undefined
				},
				transformRequest: function(data) {
					var fd = new FormData();
					angular.forEach(data, function(key, value) {
						if (value === 'attachments_attributes') {
							if (!(key instanceof Array)) key = [key];
							for (var i = 0, l = key.length; i < l; i++) {
								fd.append('attachments_attributes[][multipart]', key[i]);
							}
						} else {
							fd.append(value, key);
						}
					});
					return fd;
				},
				errorNotify: {
					code: 'NOTIFY.MESSAGE_REPLY_FAILED'
				}
			},
			unreaded: {
				params: {
					state: 'unread'
				}
			},
			markAsRead: {
				url: $$config.apiPath + '/conversations/:id/read',
				method: 'POST'
			},
			markAsUnread: {
				url: $$config.apiPath + '/conversations/:id/unread',
				method: 'POST'
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
			},
			getPosts: {
				url: $$config.apiPath + '/conversations/posts',
				method: 'GET'
			},
			downloadAttachment: {
				method: 'GET',
				url: $$config.apiPath + '/messages/:messageId/files/:fileId'
			}
		});
	}
]);