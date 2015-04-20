'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MessagesCtrl
 * @description List of messages
 */

angular.module('hearth.controllers').controller('MessagesCtrl', [
	'$scope', '$rootScope', 'Conversations', 'UnauthReload', 'Messenger',
	function($scope, $rootScope, Conversations, UnauthReload, Messenger) {
		$scope.conversations = false;
		$scope.detail = false;
		$scope.detailIndex = false;
		$scope.showFulltext = false;
		$scope.conversationFilter = 'all';
		$scope.conversationSearch = '';
		$scope.showNewMessageForm = false;
		
		$scope.toggleAddForm = function(conversation) {
			$scope.showNewMessageForm = !$scope.showNewMessageForm;
			conversation && $scope.loadNewConversations();
		};

		$scope.loadNewConversations = function() {
			// TODO
		};

		$scope.prependConversation = function(conversation) {
			$scope.conversations.unshift($scope.deserializeConversation(conversation));
			$scope.showConversation(conversation, 0);
		};

		$scope.searchConversation = function() {
			// if fulltext is hidden, first only show input
			if(!$scope.showFulltext || !$scope.conversationSearch )
				return $scope.showFulltext = !$scope.showFulltext;
		};

		$scope.showConversation = function(info, index) {
			info.read = true;
			$scope.showNewMessageForm = false;
			$scope.detail = info;
			$scope.detailIndex = index;
		};

		$scope.loadCounters = function() {
			Messenger.loadCounters(function(res) {
				$scope.conversationsCounters = res;
			});
		};

		$scope.deserializeConversation = function(conversation) {
			if(!conversation.title) {
				conversation.title = [];

				for(var id in conversation.participants) {
					var user = conversation.participants[id];

					if($rootScope.loggedUser._id !== user._id)
						conversation.title.push(user.name);
				};
				conversation.title = conversation.title.join(", ");
			}
			return conversation;
		};

		$scope.deserialize = function(conversation) {
			return conversation.map($scope.deserializeConversation);
		};

		$scope.loadConversations = function(conf, done) {
			conf = conf || {};
			conf.exclude_self = true;

			Conversations.get(conf, function(res) {
				$scope.conversations = $scope.deserialize(res.conversations);
				done && done($scope.conversations);
			});
		};
		
		function init() {
			$scope.loadCounters();
			$scope.loadConversations({}, function(list) {
				// load first conversation on init
				if(list.length)
					$scope.showConversation(list[0], 0);
			});
		};

		UnauthReload.check();
		$scope.$on('initFinished', init);
		$rootScope.initFinished && init();
	}
]);