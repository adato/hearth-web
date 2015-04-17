'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MessagesCtrl
 * @description List of messages
 */

angular.module('hearth.controllers').controller('MessagesCtrl', [
	'$scope', '$rootScope', 'Conversations', 'UnauthReload', '$timeout', 'Notify', 'Messenger',
	function($scope, $rootScope, Conversations, UnauthReload, $timeout, Notify, Messenger) {
		$scope.conversations = false;
		$scope.detail = false;
		$scope.detailIndex = false;
		$scope.showFulltext = false;
		$scope.conversationFilter = 'all';
		$scope.conversationSearch = '';
		$scope.showNewMessageForm = false;
		
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

		$scope.deserialize = function(messages) {
			return messages.map(function(msg) {
				if(!msg.title) {
					msg.title = [];

					for(var id in msg.participants) {
						var user = msg.participants[id];

						if($rootScope.loggedUser._id !== user._id)
							msg.title.push(user.name);
					};
					msg.title = msg.title.join(", ");
				}
				return msg;
			});
		};

		$scope.loadConversations = function(conf, done) {
			conf = conf || {};
			conf.exclude_self = true;

			Conversations.get(conf, function(res) {
				$scope.conversations = $scope.deserialize(res.conversations);
				done && done($scope.conversations);
			});
		};
		
		$scope.deleteConversation = function(id) {
			$scope.sendingDeleteRequest = true;
			Conversations.remove({id: id}, function(res) {

				init();
				$scope.sendingDeleteRequest = false;
				Notify.addSingleTranslate('NOTIFY.CONVERSATION_DELETE_SUCCESS', Notify.T_SUCCESS);
			}, function(err) {
				$scope.sendingDeleteRequest = false;
				Notify.addSingleTranslate('NOTIFY.CONVERSATION_DELETE_FAILED', Notify.T_ERROR);
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