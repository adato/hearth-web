'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.conversationDetail
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('conversationDetail', [
	'$rootScope', 'Conversations', '$timeout', 'Notify', 'Viewport', 'Messenger', 'PageTitle', '$translate', 'ResponsiveViewport', 'ConversationAux', '$state',
	function($rootScope, Conversations, $timeout, Notify, Viewport, Messenger, PageTitle, $translate, ResponsiveViewport, ConversationAux, $state) {
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			templateUrl: 'templates/directives/conversationDetail.html',
			link: function($scope, element) {
				// PSEUDO INJECTS
				$scope.getProfileLinkByType = $rootScope.getProfileLinkByType;
				$scope.getProfileLink = $rootScope.getProfileLink;
				$scope.loggedUser = $rootScope.loggedUser;
				$scope.DATETIME_FORMATS = $rootScope.DATETIME_FORMATS;
				$scope.pluralCat = $rootScope.pluralCat;
				$scope.confirmBox = $rootScope.confirmBox;

				// INIT VARIABLES
				// $scope.scrollBottom = false;
				// $scope.participants = false;
				$scope.showParticipants = false;
				$scope.sendingActionRequest = false;
				// $scope.lockCounter = 0;
				// $scope.messages = false;
				// var _messagesCount = 10; // how many messages will we load in each request except new messages
				$scope.info = {};

				var _scrollInited = false;
				var _loadOlderMessagesEnd = false;
				var _loadingOlderMessages = false;

				// $scope.addMessagesToList = function(messages, append) {
				// 	// concat new messages
				// 	if (!$scope.messages)
				// 		$scope.messages = messages;
				// 	else if (append)
				// 		$scope.messages = $scope.messages.concat(messages);
				// 	else
				// 		Array.prototype.unshift.apply($scope.messages, messages);
				//
				// 	// and resize message box
				// 	resizeTMessagesBox();
				//
				// 	// when we get less messages then requested, we hitted the end of list
				// 	if (!append && messages.length < _messagesCount)
				// 		_loadOlderMessagesEnd = true;
				// };

				/**
				 * Load messages
				 * @param  {[type]}   from [description]
				 * @param  {Function} done [description]
				 * @return {[type]}        [description]
				 */
				// $scope.loadMessages = function(config, done) {
				// 	var lockCounter = $scope.lockCounter;
				//
				// 	config = angular.extend(config || {}, {
				// 		id: $scope.info._id,
				// 		limit: _messagesCount
				// 	});
				//
				// 	Conversations.getMessages(
				// 		config,
				// 		function(res) {
				// 			// test if we loaded data for actual conversation detail
				// 			if (lockCounter !== $scope.lockCounter) return false;
				// 			// TODO - figure why API is sending empty array on conversations I have no right to read
				// 			if (!res.messages.length) done();
				//
				// 			// append/prepend messages
				// 			res.messages.length && $scope.addMessagesToList(res.messages, config.newer);
				//
				// 			done && done(res.messages);
				// 		}, done);
				// };

				/**
				 * If we have space on top, load older messages
				 * also add parameter to dont mark conversation as readed when loading messages
				 */
				function testOlderMessagesLoading(dontMarkAsRead) {
					if (!$rootScope.$$phase) $rootScope.$apply();
					if ($(".nano-content", element).scrollTop() < 100) {
						loadOlderMessages(dontMarkAsRead);
					}
				};

				function onContentScrolling() {
					testOlderMessagesLoading();
				};

				/**
				 * This will handle callback functions after first messages are loaded
				 */
				// function afterInitLoad() {
				// 	_loadingOlderMessages = false;
				//
				// 	$timeout(function() {
				// 		// test if we are on bottom
				// 		testOlderMessagesLoading(true);
				//
				// 		// when scrolled top, load older messages
				// 		$(".nano-content", element).scroll(onContentScrolling);
				// 	});
				// };

				// $scope.hasSystemMessage = function(messages) {
				// 	for (var i = messages.length - 1; i >= 0; i--) {
				// 		if (!messages[i].author)
				// 			return true;
				// 	}
				// 	return false;
				// };

				// $scope.getLastMessage = function(messages) {
				// 	// find last message that is not system message
				// 	for (var i = messages.length - 1; i >= 0; i--) {
				// 		if (messages[i].author)
				// 			return messages[i];
				// 	}
				// 	return false;
				// };

				// $scope.updateConversationInfo = function(messages, messagesCount) {
				// 	var lastMessage = $scope.getLastMessage(messages);
				// 	// if there is no non-system message, dont update
				// 	if (!lastMessage)
				// 		return false;
				//
				// 	// set info to conversation detail
				// 	$scope.info.message = lastMessage;
				// 	$scope.info.messages_count += messagesCount;
				//
				// 	// send info event upward
				// 	// $scope.$emit("conversationUpdated", $scope.info);
				// };

				// $scope.getLastMessageTime = function() {
				// 	if (!$scope.messages || !$scope.messages.length)
				// 		return undefined;
				//
				// 	return $scope.messages[$scope.messages.length - 1].created_at;
				// };

				// $scope.reloadConversationInfo = function() {
				// 	Conversations.get({
				// 		id: $scope.info._id,
				// 		exclude_self: true
				// 	}, function(res) {
				// 		if ($scope.participants) $scope.loadParticipants();
				//
				// 		$scope.info.is_member = res.is_member;
				// 		$scope.info.participants = res.participants;
				// 		$scope.info.participants_count = res.participants_count;
				// 		$scope.info.title = res.title;
				// 		$scope.info = $scope.deserialize($scope.info);
				//
				// 		delete $scope.info.titlePersons;
				// 		$scope.$emit("conversationDeepUpdate", $scope.info);
				// 	});
				// };

				/**
				 * Load new messages on demand through websocket message channel
				 */
				// $scope.loadNewMessages = function() {
				// 	// $scope.loadMessages({
				// 	ConversationAux.loadConversationMessages({
				// 		conversation: $scope.info,
				// 		params: {
				// 			newer: ConversationAux.getLastMessageTime($scope.info)
				// 		}
				// 	}).then(function(conversation) {
				// 		// function(messages) {
				// 		// if (messages && messages.length) {
				// 		// if ($scope.hasSystemMessage(messages)) {
				// 		// if ($scope.hasSystemMessage(conversation.messages)) {
				// 		// 	$scope.reloadConversationInfo();
				// 		// }
				//
				// 		testScrollBottom();
				// 		// $scope.updateConversationInfo(conversation.messages, conversation.messages.length);
				// 		// }
				// 	}, console.log);
				// };

				/**
				 * If user is on bottom, keep user there after added more content
				 */
				function testScrollBottom() {
					var outer = $(".nano", element);
					var inner = $(".nano-content", outer);
					var pos = Math.ceil(inner.scrollTop() + inner.height());

					if (pos >= inner.prop('scrollHeight')) {
						scrollBottom();
					}
				}

				/**
				 * Scroll to bottom
				 */
				function scrollBottom() {
					$timeout(function() {
						if ($(".nano-content", element).length > 0) {
							$(".nano-content", element).scrollTop($(".nano-content", element)[0].scrollHeight * 1000);
						}
					});
				}

				$rootScope.$on('messageAddedToConversation', function(event, conversation) {
					if (conversation && conversation.conversation && $scope.info._id === conversation.conversation._id) scrollBottom();
				});

				/**
				 * Send action request to archive/delete/leave conversation
				 * This always ends with removing a conversation from the list
				 * @param  {string} id       ID of conversation
				 * @param  {type} type     type of request DELETE/ARCHIVE/LEAVE
				 * @param  {resource} resource resource function to call
				 */
				function sendActionRequest(id, type, resourceFunc) {
					if ($scope.sendingActionRequest) return false;
					$scope.sendingActionRequest = true;
					// returns the removed conversation and its index to return it to the list in case something goes wrong
					var backup = ConversationAux.removeConversationFromList(id);

					resourceFunc({
						id: id
					}, function(res) {
						$scope.sendingActionRequest = false;
						// $scope.$emit("conversationRemoved", id);

						Notify.addSingleTranslate('NOTIFY.CONVERSATION_' + type + '_SUCCESS', Notify.T_SUCCESS);
					}, function(err) {
						$scope.sendingActionRequest = false;

						if (backup.removed && backup.removed.length) ConversationAux.addConversationToList({
							conversation: backup.removed[0],
							index: backup.index
						});
					});
				}

				// use sendActionRequest to delete conversation
				$scope.deleteConversation = function(id) {
					sendActionRequest(id, 'DELETE', Conversations.remove);
				};

				// use sendActionRequest to archive conversation
				$scope.archiveConversation = function(id) {
					sendActionRequest(id, 'ARCHIVE', Conversations.archive);
				};

				// use sendActionRequest to leave conversation
				$scope.leaveConversation = function(id) {
					sendActionRequest(id, 'LEAVE', Conversations.leave);
				};

				/**
				 * Transform conversation info so we can use it in view
				 */
				// $scope.deserialize = function(conversation) {
				// THIS IS DONE ALREADY ON CONV GET FFS

				// conversation.titleDetail = conversation.title;
				// conversation.titleCustom = false;
				//
				// if (!conversation.title) {
				// 	conversation.titleDetail = [];
				// 	conversation.titleCustom = true;
				//
				// 	// use first three participants names if we dont have title
				// 	for (var i = 0; i < 3 && i < conversation.participants.length; i++) {
				// 		var user = conversation.participants[i];
				// 		conversation.titleDetail.push(user.name);
				// 	};
				// 	conversation.titleDetail = conversation.titleDetail.join(", ");
				// }
				//
				// 	return conversation;
				// };

				/**
				 * Keep user on his position when added more messages to top
				 */
				function scrollToCurrentPosition(done) {
					var content = $(".nano-content", element);
					var height = content.prop('scrollHeight');
					var scrollTop = content.scrollTop();

					$timeout(function() {
						$scope.$broadcast("scrollbarResize");
						$(".nano-content", element).scrollTop($(".nano-content", element).prop('scrollHeight') - height + scrollTop);

						done && done();
					});
				}

				$scope.setConversationAsRead = function() {
					if (!$scope.info || $scope.info.read) return false;
					Messenger.decreaseUnread();
					$scope.info.read = true;
					Conversations.markAsRead({
						id: $scope.info._id
					});
				};

				/**
				 * Load older messages when we scrolled to top
				 */
				function loadOlderMessages(loadOlderMessages) {
					if (_loadingOlderMessages || $scope.info.messages[0].first_message || !$scope.info.messages.length) return false;
					_loadingOlderMessages = true;

					ConversationAux.loadConversationMessages({
						conversation: $scope.info,
						prepend: true,
						params: {
							older: $scope.info.messages[0] ? $scope.info.messages[0].created_at : undefined
						}
					}).then(function(conversation) {
						_loadingOlderMessages = false;

						scrollToCurrentPosition();
						if (loadOlderMessages !== true) $scope.setConversationAsRead();
					}, function(error) {
						_loadingOlderMessages = false;
					});
				}

				/**
				 * When we add new message callback
				 */
				// $scope.onMessageAdded = function() {
				// 	scrollBottom();
				// 	// $scope.loadNewMessages();
				// };

				/**
				 * Resize box with timeout
				 * - this will let view to render first
				 */
				function resizeTMessagesBox() {
					$timeout(resizeMessagesBox);
				}

				function resizeMessagesBox() {
					var container = $('.messages-container', element);
					var offset = -50;
					var measureContainer = $('.messages-container');

					if (ResponsiveViewport.isSmall()) {
						// box needs to be tall on mobile devices, so we count on whole-page-height
						measureContainer = $('#homepage-hero');
						offset = 0;
					}
					testScrollBottom();
					var maxBoxHeight = measureContainer.height() - element.find('.conversation-detail-top').outerHeight() - element.find('.messages-reply').outerHeight() + offset;
					container.css('max-height', maxBoxHeight);
					container.fadeIn();

					$timeout(function() {
						// resize scrollbar
						$scope.$broadcast('scrollbarResize');
						$scope.$broadcast('classIfOverflowContentResize');
					});
				}

				$scope.markConversationAsUnread = function(info) {
					// don't wait for server to respond, makes for better UX
					Messenger.increaseUnread();
					info.read = false;
					Conversations.markAsUnread({
						id: info._id
					});
				};

				/**
				 * Show/hide participants list & load from API
				 */
				$scope.toggleParticipants = function() {
					$scope.showParticipants = !$scope.showParticipants;
					resizeTMessagesBox();

					if ($scope.info.participants.length === $scope.info.participants_count) $scope.info.allParticipants = $scope.info.participants;

					if ($scope.showParticipants && !$scope.info.allParticipants) {
						ConversationAux.addConversationParticipants({
							conversation: $scope.info
						}).then(function(conversation) {
							resizeTMessagesBox();
							$timeout(function() {
								$scope.$broadcast('scrollbarResize');
							});
						});
					};
				};

				/**
				 * Load participants list
				 */
				// function loadParticipants() {
				// Conversations.getParticipants({
				// 	id: $scope.info._id
				// }, function(res) {
				// 	$scope.participants = res.participants;
				// 	resizeTMessagesBox(); // resize with timeout
				// 	$timeout(function() {
				// 		$scope.$broadcast('scrollbarResize');
				// 	});
				// });
				// };

				function bindActionHandlers() {
					element.bind('click', function() {
						$scope.setConversationAsRead();
					});

					element.bind('keypress', function() {
						$scope.setConversationAsRead();
					});

					var ev = $scope.$on('scrollbarResize', function() {
						ev();

						$(".nano-content", element).bind('scroll mousedown wheel DOMMouseScroll mousewheel keyup', function(e) {
							if (e.which > 0 || e.type == "mousedown" || e.type == "mousewheel") {
								$scope.setConversationAsRead();
							}
						});
					});
				}

				function setTitle() {
					var title = ($scope.info.post) ? $translate.instant($scope.info.post.type_code) + ' ' + $scope.info.titleDetail : $scope.info.titleDetail;
					PageTitle.setTranslate('TITLE.messages.detail', title);
				}

				/**
				 * Config init variables deserialize conversation
				 * and load messages
				 */
				function init(conversationId) {
					// $scope.lockCounter++;
					// set initial state
					_loadOlderMessagesEnd = false;
					_scrollInited = false;
					// $scope.messages = false;
					// $scope.participants = false;
					$scope.showParticipants = false;
					$timeout(function() {
						bindActionHandlers();
					}, 10);

					ConversationAux.loadConversation(conversationId).then(function(conversation) {
						$scope.info = conversation;
						setTitle();
						$scope.loaded = true;

						$timeout(function() {
							// binding here so that even ng-ifed things are done
							$('.nano-content', element).scroll(onContentScrolling);
						}, 10);
					}, console.info);
				}

				init($state.params.id);

				// $scope.deserializeInfo = function(info) {
				// 	// $scope.info = $scope.deserialize($scope.info);
				// 	setTitle();
				// };

				// resize box when needed
				$(window).resize(resizeMessagesBox);
				$scope.$on("conversationReplyFormResized", resizeMessagesBox);
				// $scope.$watch('updateTitle', $scope.setTitle);
				// $scope.$watch('info', $scope.init);
				// $scope.$watch('info', $scope.deserializeInfo, true);
				// $scope.$on('loadNewMessages', $scope.loadNewMessages);
				// $scope.$on('conversationMessageAdded', $scope.onMessageAdded);
				$scope.$on('$destroy', function() {
					$(window).off('resize', resizeMessagesBox);
				});
			}
		};
	}
]);