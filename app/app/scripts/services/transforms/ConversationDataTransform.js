'use strict';

/**
 * @ngdoc factory
 * @name hearth.services.ConversationDataTransform
 * @description transform functions for conversations
 */

angular.module('hearth.services').factory('ConversationDataTransform', ['$window', '$translate', function($window, $translate) {

	var factory = {
		enrichWithTitles: enrichWithTitles
	};

	return factory;

	/////////////////

	/**
	 *	Enriches conversation(s) with title, peopleTitle and titleDetail
	 *	@param {Object} res -
	 */
	function enrichWithTitles(res) {
		return JSON.parse(res);

		if (res && typeof(res) === 'string') {
			try {
				var conversationObject = JSON.parse(res);
				var conversationArray;
				if (conversationObject.conversations) {
					conversationArray = conversationObject.conversations;
				} else {
					conversationArray = [conversationObject];
				}
				for (var i = conversationArray.length; i--;) {
					var conversation = conversationArray[i];

					if (conversation._id) {
						conversation.maxAvatarCount = (conversation.participants_count > 4) ? 3 : 4; // print 4 avatars max or only 3 avatars and 4th will be +X counter

						// if it is post reply conversation, add post type
						if (!conversation.title && conversation.post && conversation.post.title) {
							conversation.title = conversation.post.title;
							conversation.post.type_code = (conversation.post.author._type == 'User' ? (conversation.post.type == 'offer' ? 'OFFER' : 'NEED') : (conversation.post.type == 'offer' ? 'WE_OFFER' : 'WE_NEED'));
							conversation.post.type_translate = $translate.instant(conversation.post.type_code);
						}
						// if there is no title, build it from its first at most 3 participants
						if (conversation.participants.length) {
							conversation.titlePersons = [];
							for (var i = 0; i < 2 && i < conversation.participants.length; i++) {
								conversation.titlePersons.push(conversation.participants[i].name);
							}
							conversation.titlePersons = conversation.titlePersons.join(', ');
						}
						conversation.titleDetail = conversation.title || conversation.titlePersons;
					}
				}

				return conversationObject;
			} catch (err) {
				console.log('CATCHED:', err);
				return res;
			}
		}
		return res;
	}

}]);