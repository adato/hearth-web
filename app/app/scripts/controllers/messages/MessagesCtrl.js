'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MessagesCtrl
 * @description List of messages
 */

angular.module('hearth.controllers').controller('MessagesCtrl', [
	'$scope', '$rootScope', 'Conversations', 'UnauthReload', '$timeout', 'Notify',
	function($scope, $rootScope, Conversations, UnauthReload, $timeout, Notify) {
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
			Conversations.getCounters({}, function(res) {
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
					return msg;
				}
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
		
		$scope.validateReply = function(reply) {
			var invalid = false;

			if(!reply.text || reply.text.length < 5)
				invalid = $scope.showError.text = true;
			
			return !invalid;
		};

		$scope.sendReply = function(reply) {
			reply.id = $scope.detail._id;

			if(!$scope.validateReply(reply))
				return false;

			if($scope.sendingReply)
				return false;
			$scope.sendingReply = true;

			Conversations.reply(reply, function(res) {

				$scope.reply.text = '';
				$scope.showError.text = false;
				$scope.replyForm.show = false;

				$scope.detail.messages = res.messages;

				$scope.sendingReply = false;
				Notify.addSingleTranslate('NOTIFY.MESSAGE_REPLY_SUCCESS', Notify.T_SUCCESS);
			}, function(err) {
				$scope.sendingReply = false;
				Notify.addSingleTranslate('NOTIFY.MESSAGE_REPLY_FAILED', Notify.T_ERROR);
			});
		};

		function init() {
			$scope.loadCounters();
			$scope.loadConversations({}, function(list) {
				// load first conversation on init
				list.length && $scope.loadConversationDetail(list[0]._id);
			});
		};

		UnauthReload.check();
		$scope.$on('initFinished', init);
		$rootScope.initFinished && init();
	}
]);