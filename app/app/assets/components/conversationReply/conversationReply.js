'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.conversationReply
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('conversationReply', [
	'Conversations', 'Notify', '$timeout', 'FileService', '$rootScope', 'ConversationAux',
	function(Conversations, Notify, $timeout, FileService, $rootScope, ConversationAux) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				conversation: '='
			},
			templateUrl: 'assets/components/conversationReply/conversationReply.html',
			link: function($scope, el, attrs) {
				$scope.sendingReply = false;
				$scope.showError = {
					text: false
				};
				$scope.actors = [];
				$scope.actorsCount = 0;
				$scope.reply = {
					text: '',
					current_community_id: '',
					attachments_attributes: ''
				};

				$scope.validateReply = function(reply) {
					var invalid = false;
					if (!reply.text) invalid = $scope.showError.text = true;
					return !invalid;
				};

				$scope.onResize = function() {
					$scope.$emit('conversationReplyFormResized');
				};

				// TODO change for some nice directive
				// instead of this ugly workaround
				$scope.focusInput = function(selector) {
					var target = el[0].querySelector(selector);
					if (target) target.focus();
				}

				$scope.sendReply = function(reply) {

					// backup the reply object and clear it up
					// DO NOT USE JSON.PARSE / STRINGIFY FOR THE REPLY MIGHT CONTAIN FILE(S)
					// attachments are only emptied post-sending so that they display their animation
					var replyCopy = {};
					for (var prop in reply) {
						if (reply.hasOwnProperty(prop)) replyCopy[prop] = reply[prop];
					}
					replyCopy.id = $scope.conversation._id;
					$scope.reply.text = '';

					var params = {};
					if (reply.current_community_id && reply.current_community_id !== $rootScope.loggedUser._id) params.current_community_id = reply.current_community_id;
					delete reply.current_community_id;

					if ($scope.sendingReply || !$scope.validateReply(replyCopy)) return false;
					$scope.sendingReply = true;


					Conversations.reply(params, replyCopy, function(res) {
						$scope.reply.attachments_attributes = '';

						$timeout(function() {
							$('textarea', el).trigger('autosize.resize');
							$('#message-footer').removeClass('message-actions');
							$scope.onResize();
						});

						if ($scope.msgReplyForm) {
							$scope.msgReplyForm.$setUntouched();
							$scope.msgReplyForm.$setPristine();
						}

						$scope.sendingReply = false;
						$scope.showError.text = false;
						// $scope.$emit('conversationMessageAdded', res);

						ConversationAux.handleEvent({
							action: 'created',
							conversation: res
						});
					}, function(err) {
						$scope.sendingReply = false;
					});
				};

				// $scope.closeConversation = function() {
				// 	$scope.$emit('closeConversation');
				// }

				$scope.init = function() {
					Conversations.get({
						id: $scope.conversation._id
					}, function(res) {
						$scope.conversation.possible_actings = res.possible_actings;
						$scope.actors = $scope.conversation.possible_actings;

						if ($scope.actors.length > 1 || ($scope.actors.length === 1 && $scope.actors[0]._type === 'Community')) {
							$scope.reply.current_community_id = ($scope.actors[0]._type == 'User' ? '' : $scope.actors[0]._id);
						}
					}, function(res) {});
				};
				$scope.init();
			}
		};
	}
]);