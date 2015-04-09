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
		$scope.reply = {
			text: ''
		};
		$scope.replyForm = {
			show: false
		};
		$scope.showError = {
			text: false
		};
		
		$scope.showConversation = function(id) {
			if($scope.detail._id == id) return false;
			
			$scope.detail = false;
			$scope.loadConversationDetail(id);
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

		$scope.loadConversationDetail = function(id) {
			$scope.detail = false;

			Conversations.get({id: id}, function(res) {
				$scope.replyForm.text = false;
				$scope.showError.text = false;
				$scope.reply.text = '';

				$scope.detail = res;
				$scope.replyForm.show = false;
			});
		};
		
		function init() {
			$scope.loadCounters();
			$scope.loadConversations({}, function(list) {
				console.log(list);
				// load first conversation on init
				list.length && $scope.loadConversationDetail(list[0]._id);
			});
		};

		UnauthReload.check();
		$scope.$on('initFinished', init);
		$rootScope.initFinished && init();
	}
]);