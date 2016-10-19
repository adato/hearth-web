'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.conversationReply
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('conversationReply', [
	'Conversations', 'Notify', '$timeout', 'FileService', '$rootScope',
	function(Conversations, Notify, $timeout, FileService, $rootScope) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				conversation: '='
			},
			templateUrl: 'templates/directives/conversationReply.html',
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

				$scope.sendReply = function(reply) {
					reply = JSON.parse(JSON.stringify(reply));
					console.log(reply);
					reply.id = $scope.conversation._id;
					var params = {};
					if (reply.current_community_id && reply.current_community_id !== $rootScope.loggedUser._id) params.current_community_id = reply.current_community_id;
					delete reply.current_community_id;

					if ($scope.sendingReply || !$scope.validateReply(reply)) return false;
					$scope.sendingReply = true;
					Conversations.reply(params, reply, function(res) {
						$scope.reply.text = '';
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
						$scope.$emit('conversationMessageAdded', res);
					}, function(err) {
						$scope.sendingReply = false;
					});
				};

				$scope.closeConversation = function() {
					$scope.$emit('closeConversation');
				}

				$scope.init = function() {
					$scope.actors = $scope.conversation.possible_actings;

					if ($scope.actors.length > 1 || ($scope.actors.length === 1 && $scope.actors[0]._type === 'Community')) {
						$scope.reply.current_community_id = ($scope.actors[0]._type == 'User' ? '' : $scope.actors[0]._id);
					}
				};
				$scope.init();
			}
		};
	}
]);