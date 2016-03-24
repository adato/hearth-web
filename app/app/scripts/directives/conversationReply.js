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
			controller: [function() {

			}],
			controllerAs: 'conversationReply',
			link: function($scope, el, attrs) {
				$scope.sendingReply = false;
				$scope.actors = [];
				$scope.actorsCount = 0;
				$scope.invalidFileType = ConversationService.getCleanInvalidFileType();
				$scope.reply = {
					text: '',
					current_community_id: '',
					attachments_attributes: ''
				};
				$scope.showError = {
					text: false
				};

				$scope.openUploadDialog = function() {
					$('#file').click();
				};

				$scope.clearFileInput = function() {
					$scope.reply.attachments_attributes = '';
					angular.element("input[type='file']").val(null);
				};

				$scope.uploadedFile = function(element) {
					ConversationService.onFileUpload($scope, element, 'reply');
					if (!$scope.$$phase) $scope.$apply();
				};

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

					Conversations.reply(reply, function(res) {
						$scope.clearFileInput();
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