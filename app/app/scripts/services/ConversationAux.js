'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ConversationAux
 * @description functions and cache for conversations
 */

angular.module('hearth.services').factory('ConversationAux', ['$q', 'Conversations', '$location', function($q, Conversations, $location) {

	var ACTION_NEW_CONVERSATION = 'conversationCreated',
		ACTION_NEW_MESSAGE = 'message',
		ACTION_CONVERSATION_READ = 'conversationMarkedRead',
		ACTION_CONVERSATION_UNREAD = 'conversationMarkedUnread';

	var conversationList = [],
		conversationListLoading,
		conversationListLoaded,
		conversationGetLimit = 20;

	// var validConversationFilters = ['archived', 'from_admin', 'as_replies', 'as_replies_post', 'from_community', 'users_posts'];

	var factory = {
		handleEvent: handleEvent,
		loadConversation: loadConversation,
		loadConversations: loadConversations
	};

	return factory;

	///////////////

	/**
	 *	@param {Object} socketEvent
	 */
	function handleEvent(socketEvent) {
		console.log(socketEvent);

		switch (socketEvent.action) {
			case:
		}
	}

	/**
	 *	@param {Int} id [optional] - id of the conversation to resolve, or first conversation found
	 *	@return $q promise - resolves into conversation if found (locally or remote), else rejects
	 */
	function loadConversation(id) {
		return $q(function(resolve, reject) {
			if (!id) resolve(conversationListLoaded && conversationList.length ? conversationList[0] : false);
			for (var i = 0, l = conversationList.length; i < l; i++) {
				if (conversationList[i]._id === id) resolve(conversationList[i]);
			}
			Conversations.get({
				id: id
			}, resolve, reject);
		});
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
				conversationList[paramObject.prepend ? 'unshift' : 'push'].apply(conversationList, res.conversations);

				console.log(conversationList);
				resolve(conversationList);
			}, reject);
		});
	}

}]);