'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.conversationAdd
 * @description Form for new conversation
 * @restrict E
 */

angular.module('hearth.directives').directive('conversationAdd', [
	'$rootScope', 'Conversations', 'Notify', 'FileService', '$timeout', 'ConversationAux', '$state',
	function($rootScope, Conversations, Notify, FileService, $timeout, ConversationAux, $state) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				recipient: '=?',
				onError: '=',
				onSuccess: '=',
				notifyContainer: '@',
				close: '=',
			},
			templateUrl: 'templates/directives/conversationAdd.html',
			link: function($scope, element) {
				$scope.userHasRight = $rootScope.userHasRight;

				$scope.sendingMessage = false;
				$scope.showError = {
					text: false,
					participant_ids: false,
				};
				$scope.message = {
					recipients_ids: [],
					title: '',
					text: '',
					attachments_attributes: '',
					from_admin: (($scope.recipient && $scope.recipient.only_replies) || false)
				};

				$scope.hideRecipientsError = function() {
					$scope.showError.recipients_ids = false;
				};

				$scope.showRecipientsError = function() {
					// Timeout is required for IE as it fails to reset focus
					// on input after picking a recipient and resolves
					// prematurely to an erroneous state.
					$timeout(function() {
						if (!($scope.message.recipients_ids && $scope.message.recipients_ids.length)) $scope.showError.recipients_ids = true;
					}, 200);
				};

				$scope.isValid = function(msg) {
					var invalid = false;

					// if there is presetted recipient, add him to list
					if ($scope.recipient) {
						msg.recipients_ids = [$scope.recipient];
						// else test if there are selected recipients
					} else if (!msg.recipients_ids.length) {
						invalid = $scope.showError.participant_ids = true;
					}

					if ($scope.addMessageForm.text.$invalid)
						invalid = $scope.showError.text = true;
					return !invalid;
				};

				$scope.serialize = function(msg) {
					msg.recipients_ids.map(function(item) {
						if (item._type === 'Community') {
							if (!msg.community_ids) {
								msg.community_ids = [];
							}
							msg.community_ids.push(item._id);
						} else {
							if (!msg.participant_ids) {
								msg.participant_ids = [];
							}
							msg.participant_ids.push(item._id);
						}
					});

					delete msg.recipients_ids;
					return msg;
				};

				function serializeMessage(source) {
					var target = {}
					for (var prop in source) {
						if (source.hasOwnProperty(prop)) {
							if (prop === 'recipients_ids') {
								source[prop].map(function(item) {
									if (item._type === 'Community') {
										if (!target.community_ids) target.community_ids = [];
										target.community_ids.push(item._id);
									} else {
										if (!target.participant_ids) target.participant_ids = [];
										target.participant_ids.push(item._id);
									}
								});
							} else {
								target[prop] = source[prop];
							}
						}
					}
					return target;
				}

				/**
				 * Validate message and send to API
				 */
				$scope.addMessage = function(msg) {

					if (!$scope.isValid(msg)) {
						return false;
					}

					var message = serializeMessage(msg);

					if ($scope.sendingMessage) {
						return false;
					}

					$scope.sendingMessage = true;

					Conversations.add(message, function(res) {
						$scope.message.attachments_attributes = '';
						$scope.sendingMessage = false;

						$timeout(function() {
							$('#message-footer').removeClass('message-actions');
						});

						if ($scope.onSuccess) {
							$scope.onSuccess(res);
						} else {
							Notify.addSingleTranslate('NOTIFY.MESSAGE_SEND_SUCCESS', Notify.T_SUCCESS);
						}

						ConversationAux.addConversationToList({
							conversation: res,
							index: 0
						});
						$state.go('messages.detail', {
							id: res._id
						});
						// $scope.$emit("conversationCreated", res);
						// $scope.close(res);
					}, function(err) {
						$scope.sendingMessage = false;

						if ($scope.onError) {
							$scope.onError(err);
						}
					});
				};

				$scope.getFirstConversationId = function() {
					return ConversationAux.getFirstConversationIdIfAny();
				}
			}
		};
	}
]);