'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.conversationReply
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('conversationReply', [
	'Conversations', 'Notify', '$timeout', 'FileService', 'ConversationAux', '$rootScope',
	function(Conversations, Notify, $timeout, FileService, ConversationAux, $rootScope) {
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

					if (!reply.text)
						invalid = $scope.showError.text = true;
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
					reply = JSON.parse(JSON.stringify(reply));
					$scope.reply.text = '';
					$scope.reply.attachments_attributes = '';

					// set conversation id
					reply.id = $scope.conversation._id;

					// set params and handle community response prop
					var params = {};
					if (reply.current_community_id && reply.current_community_id !== $rootScope.loggedUser._id) params.current_community_id = reply.current_community_id;
					delete reply.current_community_id;

					if ($scope.sendingReply || !$scope.validateReply(reply)) return false;
					$scope.sendingReply = true;

					Conversations.reply(reply, function(res) {
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
						ConversationAux.handleEvent({
							action: 'created',
							conversation: res
						});
					}, function(err) {
						$scope.sendingReply = false;
					});
				};

				$scope.init = function() {
					$scope.actors = $scope.conversation.possible_actings;

					if ($scope.actors.length > 1) {
						$scope.reply.current_community_id = ($scope.actors[0]._type == "User" ? '' : $scope.actors[0]._id);
					}
				};
				$scope.init();
			}
		};
	}
]);