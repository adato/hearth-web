'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.conversationReply
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('conversationReply', [
	'Conversations', 'Notify', '$timeout', 'ConversationService',
	function(Conversations, Notify, $timeout, ConversationService) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				conversation: '='
			},
			templateUrl: 'templates/directives/conversationReply.html',
			link: function($scope, el, attrs) {
				$scope.sendingReply = false;
				$scope.invalidFileType = ConversationService.getCleanInvalidFileType();
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

				$scope.uploadedFile = function(element) {
					$scope.$apply(function($scope) {
						ConversationService.onFileUpload($scope, element, 'reply');
					});
				};

				$scope.removeAttachments = function() {
					$scope.invalidFileType = ConversationService.getCleanInvalidFileType();
					$scope.reply.attachments_attributes = '';
				}

				$scope.validateReply = function(reply) {
					var invalid = false;

					if (!reply.text)
						invalid = $scope.showError.text = true;
					return !invalid;
				};

				$scope.onResize = function() {
					$scope.$emit('conversationReplyFormResized');
				};

				$scope.sendReply = function(reply) {
					reply.id = $scope.conversation._id;
					if ($scope.sendingReply || !$scope.validateReply(reply))
						return false;
					$scope.sendingReply = true;
					console.log(reply);
					Conversations.reply(reply, function(res) {
						$scope.removeAttachments();
						$scope.reply.text = '';

						$timeout(function() {
							$('textarea', el).trigger('autosize.resize');
							$scope.onResize();
						});

						$scope.msgReplyForm.$setUntouched();
						$scope.msgReplyForm.$setPristine();

						$scope.sendingReply = false;
						$scope.showError.text = false;
						$scope.$emit("conversationMessageAdded", res);
					}, function(err) {
						$scope.sendingReply = false;
					});
				};

				$scope.closeConversation = function() {
					$scope.$emit('closeConversation');
				}

				$scope.init = function() {
					$scope.actors = $scope.conversation.possible_actings;

					if ($scope.actors.length == 1) {
						$scope.reply.current_community_id = ($scope.actors[0]._type == "User" ? '' : $scope.actors[0]._id);
					}
				};
				$scope.init();
			}
		};
	}
]);