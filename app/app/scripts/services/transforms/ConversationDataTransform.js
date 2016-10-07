'use strict';

/**
 * @ngdoc factory
 * @name hearth.services.ConversationDataTransform
 * @description transform functions for conversations
 */

angular.module('hearth.services').factory('ConversationDataTransform', ['$window', '$injector', '$translate', function($window, $injector, $translate) {

	var factory = {
		enrichWithTitles: enrichWithTitles
	};

	return factory;

	/////////////////

	/**
	 *	Enriches conversation(s) with title, peopleTitle and titleDetail
	 *	@param {Object} res -
	 */
	function enrichWithTitles(res, headers, status) {
		if (res && typeof res === 'string' && (status === 200 || status === 304)) {
			var conversationArray = [];
			try {
				var conversationObject = JSON.parse(res);
				if (conversationObject.conversations) {
					conversationArray = conversationObject.conversations;
				} else {
					conversationArray = [conversationObject];
				}
				for (var convCounter = conversationArray.length; convCounter--;) {
					var conversation = conversationArray[convCounter];
					$injector.get('ConversationAux').deserializeConversation(conversation);
				}
				return conversationObject;
			} catch (err) {
				console.error('Error parsing conversations:', err);
				try {
					var parsedRes = JSON.parse(res);
					return parsedRes;
				} catch (err) {}
			}
		}
		return res;
	}

}]);