'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ConversationAux
 * @description functions and cache for conversations
 */

angular.module('hearth.services').factory('ConversationAux', ['$q', 'Conversations', '$location', 'ActionCableSocketWrangler', 'ActionCableChannel', '$rootScope', function($q, Conversations, $location, ActionCableSocketWrangler, ActionCableChannel, $rootScope) {

	var inited,
		processingRunning;

	var ACTION_NEW_CONVERSATION = 'created',
		ACTION_NEW_MESSAGE = 'created',
		ACTION_CONVERSATION_READ = 'read',
		ACTION_CONVERSATION_UNREAD = 'unread',
		ACTION_CONVERSATION_ARCHIVED = 'archived',
		ACTION_CONVERSATION_DELETED = 'deleted';

	var MESSAGE_LIMIT = 15;

	var conversationList = [],
		conversationListLoading,
		conversationListLoaded,
		conversationGetLimit = 20;

	var FILTER_ARCHIVE = 'archive';

	var factory = {
		addConversationToList: addConversationToList,
		init: init,
		handleEvent: handleEvent,
		loadConversation: loadConversation,
		loadConversationMessages: loadConversationMessages,
		loadConversations: loadConversations,
		MESSAGE_LIMIT: MESSAGE_LIMIT,
		removeConversationFromList: removeConversationFromList
	};

	return factory;

	///////////////

	/**
	 *	Function that starts the socket and optionally enables further processing of socket events
	 *	This is to prevent the loading of conversations etc prior to first visiting the conversations screen, i.e. running MessagesCtrl
	 *
	 *	In orderUser has to be logged in prior to calling this
	 *
	 *	- {Boolean} enableProcessing - value telling whether or not to enable processing of socket events
	 */
	function init(paramObject) {
		paramObject = paramObject || {};
		var token = {
			token: $.cookie('authToken')
		};
		if (token.token) {
			// optionally enable processing of socket events
			if (paramObject.enableProcessing) processingRunning = true;

			// only ever create socket connection once
			if (inited) return true;
			inited = true;

			var consumer = new ActionCableChannel('MessagesChannel', token);
			// TODO - cleanup after these
			// Messenger.loadCounters();
			// $rootScope.$broadcast('WSNewMessage', message);
			// /TODO
			ActionCableSocketWrangler.start();
			consumer.subscribe(handleEvent);
			return true;
		}
		return false;
	}

	/**
	 *	@param {Object} socketEvent - event coming from socket with one the following actions:
	 *		- archived, deleted, created, read, unread
	 */
	function handleEvent(socketEvent) {
		console.log(socketEvent);
		if (!processingRunning) return void 0;

		switch (socketEvent.action) {
			case ACTION_NEW_CONVERSATION:
			case ACTION_NEW_MESSAGE:
				return handleNewConversationOrMessage(socketEvent);
			case ACTION_CONVERSATION_READ:
				return handleConversationReadStatus(socketEvent, true);
			case ACTION_CONVERSATION_UNREAD:
				return handleConversationReadStatus(socketEvent, false);
			case ACTION_CONVERSATION_ARCHIVED:
				return handleConversationArchived(socketEvent);
			case ACTION_CONVERSATION_DELETED:
				return handleConversationDeleted(socketEvent);
		}
	}

	function handleNewConversationOrMessage(socketEvent) {
		if (socketEvent.conversation && socketEvent.conversation.message) {
			if (socketEvent.conversation.message.first_message) {
				return conversationList.unshift(socketEvent.conversation);
			} else {
				var conv;
				for (var i = conversationList.length; i--;) {
					if (conversationList[i]._id === socketEvent.conversation._id) {
						conv = conversationList.splice(i, 1)[0];
						// update some properties
						conv.message = socketEvent.conversation.message;
						// if the found conversation already has 'messages' prop, append the new message to it
						if (conv.messages && conv.messages.length) {
							conv.messages.push(socketEvent.conversation.message);
							$rootScope.$emit('messageAddedToConversation', {
								conversation: conv
							});
						}
						break;
					}
				}
				return conversationList.unshift(conv);
			}
		}
	}

	function handleConversationReadStatus(socketEvent, readStatus) {
		if (socketEvent.conversation) {
			for (var i = 0, l = conversationList.length; i < l; i++) {
				if (conversationList[i]._id === socketEvent.conversation._id) return conversationList[i].read = readStatus;
			}
		}
		return false;
	}

	function handleConversationListChange(socketEvent) {
		if (conversationFilter.current === FILTER_ARCHIVE) {
			return conversationList.unshift(socketEvent.conversation);
		} else {
			return removeConversationFromList(socketEvent.conversation._id);
		}
	}

	function handleConversationDeleted(socketEvent) {
		return removeConversationFromList(socketEvent.conversation._id);
	}

	/**
	 *	- {Object} conversation - conversation to add to the list
	 *	- {Int} index - the index to which to add the conversation
	 *	@return index to which the conversation has been added or false if not added
	 */
	function addConversationToList(paramObject) {
		if (!paramObject.conversation) return false;
		if (paramObject.index > conversationList.length) paramObject.index = conversationList.length;
		conversationList.splice(paramObject.index, 0, paramObject.conversation);
		return paramObject.index;
	}

	/**
	 *	@param {Int} conversationId
	 *	@return {Object}	- {Array} removed - the removed conversation
	 *						- {Int} index - the index from which the conversation has been removed
	 */
	function removeConversationFromList(conversationId) {
		for (var i = conversationList.length; i--;) {
			if (conversationList[i]._id === conversationId) return {
				removed: conversationList.splice(i, 1),
				index: i
			};
		}
		return {
			removed: [],
			index: void 0
		};
	}

	/**
	 *	@param {Int} id [optional] - id of the conversation to resolve, or first conversation found
	 *	@return $q promise - resolves into conversation if found (locally or remote), else rejects
	 */
	function loadConversation(id) {
		return $q(function(resolve, reject) {
			if (!id) resolve(conversationListLoaded && conversationList.length ? conversationList[0] : false);
			for (var i = 0, l = conversationList.length; i < l; i++) {
				if (conversationList[i]._id === id) {
					if (conversationList[i].messages && conversationList[i].messages.length) {
						return resolve(conversationList[i]);
					} else {
						return loadConversationMessages({
							conversation: conversationList[i]
						}).then(resolve);
					}
				}
			}
			Conversations.get({
				id: id
			}, function(conversation) {
				loadConversationMessages({
					conversation: conversation
				}).then(function(conversation) {
					// to keep the conversationList consistent, either find the current conversation in the list now
					// OR append it there
					var foundMatch;
					for (var i = 0, l = conversationList.length; i < l; i++) {
						if (conversationList[i]._id === conversation._id) {
							conversationList[i] = conversation;
							foundMatch = true;
						}
					}
					if (!foundMatch) conversationList.push(conversation);
					resolve(conversation);
				});
			}, reject);
		});
	}

	/**
	 *	Function that either fetches new conversation messages for given conversationId and resolves messages Array
	 *	OR is given a conversation object and extends it with conversation messages on property 'messages'
	 *
	 *	- {Int} conversationId [required (if not 'conversation')]
	 *	- {Object} conversation [required (if not 'conversationId')] (has to have property '_id')
	 *	- {Boolean} prepend [default = false] i.e. append by default (only applicable if conversation object supplied)
	 *	- {Object} params - parametres for $resource.getMessages call
	 *	@return {$q Promise} that resolves into [array of messages || conversation extended with property 'messages']
	 */
	function loadConversationMessages(paramObject) {
		paramObject = paramObject || {};
		var params = angular.extend(paramObject.params || {}, {
			limit: MESSAGE_LIMIT
		});
		return $q(function(resolve, reject) {
			if (paramObject.conversationId) {
				params.id = paramObject.conversationId
			} else if (paramObject.conversation && paramObject.conversation._id) {
				params.id = paramObject.conversation._id;
			} else {
				// if no conversation ID specified, do not proceed further
				console.error('THIS SHOULD NOT BE CALLED LIKE THIS!');
				return resolve(false);
			}
			Conversations.getMessages(params, function(res) {
				var result;
				if (paramObject.conversationId) {
					result = res.messages;
				} else {
					result = paramObject.conversation;
					if (!(result.messages && result.messages.length)) {
						result.messages = res.messages;
					} else {
						Array.prototype[paramObject.prepend ? 'unshift' : 'push'].apply(result.messages, res.messages);
					}
				}
				if (!paramObject.prepend && paramObject.conversation) updateConversationInfo(paramObject);
				resolve(result);
			}, reject);
		});
	}

	/**
	 *	Returns last conversation message that is not system-message
	 *	- {Object} conversation - has to have property 'messages' with at least one message
	 *	@return {Object} message || false
	 */
	function getLastUserMessage(paramObject) {
		paramObject = paramObject || {};
		if (!(paramObject.conversation && paramObject.conversation.messages && paramObject.conversation.messages.length)) return false;
		for (var i = paramObject.conversation.messages.length - 1; i >= 0; i--) {
			if (paramObject.conversation.messages[i].author) return paramObject.conversation.messages[i];
		}
		return false;
	}

	/**
	 *	Updates last conversation text
	 *	- {Object} conversation - has to have property 'messages' with at least one message
	 */
	function updateConversationInfo(paramObject) {
		paramObject = paramObject || {};
		if (!(paramObject.conversation && paramObject.conversation.messages && paramObject.conversation.messages.length)) return false;
		var lastMessage = getLastUserMessage(paramObject);
		if (lastMessage) paramObject.conversation.message = lastMessage;
	}

	/**
	 *	- {Boolean} wipe - remove all items from the conversation list before adding new
	 *	- {Int} limit - how many should be fetched
	 *	- {Int} offset - how many should be skipped
	 *	- {String} filterType - filter - type
	 *	- {String} post_id - filter - only conversations about a specific marketplace post
	 *	- {String} query - filter - only conversations matching the query
	 *	- {Boolean} prepend - if TRUE - the fetched conversations shall be prepended to the list, instead of appending
	 */
	function loadConversations(paramObject) {
		paramObject = paramObject || {};
		if (conversationListLoading) resolve(conversationList);
		return $q(function(resolve, reject) {
			conversationListLoading = true;
			var params = {
				limit: paramObject.limit || conversationGetLimit,
				offset: paramObject.offset || 0
			}
			if (paramObject.filterType) params[paramObject.filterType] = true;
			if (paramObject.post_id) params.post_id = paramObject.post_id;
			if (paramObject.query) params.query = paramObject.query;

			console.log(params);
			Conversations.get(params, function(res) {
				conversationListLoading = false;
				conversationListLoaded = true;
				if (paramObject.wipe) conversationList.length = 0;

				removeDuplicates({
					source: conversationList,
					target: res.conversations,
					comparator: '_id'
				});

				conversationList[paramObject.prepend ? 'unshift' : 'push'].apply(conversationList, res.conversations);
				resolve(conversationList);
			}, reject);
		});
	}

	/**
	 *	Strips 'target' of items existing in 'source'. Decides on the given comparator (=property name)
	 *
	 *	- {Array} source
	 *	- {Array} target
	 *	- {String} comparator
	 *	@return void 0
	 */
	function removeDuplicates(paramObject) {
		var map = {};
		// create map
		for (var i = paramObject.source.length; i--;) {
			map[paramObject.source[i][paramObject.comparator]] = true;
		}
		// remove existing entries from target
		for (var i = paramObject.target.length; i--;) {
			if (map[paramObject.target[i][paramObject.comparator]]) paramObject.target.splice(i, 1);
		}
		return;
	}

}]);