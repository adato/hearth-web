'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.conversationDetail
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('conversationDetail', [
	'$rootScope', 'Conversations', '$timeout', 'Notify', 'Viewport', 'Messenger', 'PageTitle', '$translate', 'ResponsiveViewport',
	function($rootScope, Conversations, $timeout, Notify, Viewport, Messenger, PageTitle, $translate, ResponsiveViewport) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				info: '=',
			},
			templateUrl: 'templates/directives/conversationDetail.html',
			link: function($scope, element) {
				$scope.getProfileLinkByType = $rootScope.getProfileLinkByType;
				$scope.getProfileLink = $rootScope.getProfileLink;
				$scope.loggedUser = $rootScope.loggedUser;
				$scope.DATETIME_FORMATS = $rootScope.DATETIME_FORMATS;
				$scope.pluralCat = $rootScope.pluralCat;
				$scope.confirmBox = $rootScope.confirmBox;
				$scope.scrollBottom = false;
				$scope.participants = false;
				$scope.showParticipants = false;
				$scope.sendingActionRequest = false;
				$scope.lockCounter = 0;
				$scope.messages = false;
				var _messagesCount = 10; // how many messages will we load in each request except new messages
				var _loadTimeout = 30000; // pull requests interval in ms
				var _loadLock = false; // pull requests interval in ms
				var _scrollInited = false;
				var _loadOlderMessagesEnd = false;
				var _loadTimeoutPromise = false;
				var _loadingOlderMessages = false;

				$scope.addMessagesToList = function(messages, append) {
					// concat new messages
					if (!$scope.messages)
						$scope.messages = messages;
					else if (append)
						$scope.messages = $scope.messages.concat(messages);
					else
						Array.prototype.unshift.apply($scope.messages, messages);

					// and resize message box
					$scope.resizeTMessagesBox();


					// when we get less messages then requested, we hitted the end of list
					if (!append && messages.length < _messagesCount)
						_loadOlderMessagesEnd = true;
				};

				/**
				 * Load messages 
				 * @param  {[type]}   from [description]
				 * @param  {Function} done [description]
				 * @return {[type]}        [description]
				 */
				$scope.loadMessages = function(config, done, dontMarkAsReaded) {
					var lockCounter = $scope.lockCounter;
					config = angular.extend(config || {}, {
						id: $scope.info._id,
						limit: _messagesCount,
						no_read: !!dontMarkAsReaded
					});
					Conversations.getMessages(
						config,
						function(res) {
							// test if we loaded data for actual conversation detail
							// if(config.id !== $scope.info._id) return false;
							if (lockCounter !== $scope.lockCounter) return false;

							// append/prepend messages
							res.messages.length && $scope.addMessagesToList(res.messages, config.newer);

							done && done(res.messages);
						}, done);
				};

				/**
				 * If we have space on top, load older messages
				 * also add parameter to dont mark conversation as readed when loading messages
				 */
				$scope.testOlderMessagesLoading = function(dontMarkAsReaded) {
					if ($(".nano-content", element).scrollTop() < 100)
						$scope.loadOlderMessages(dontMarkAsReaded);
				};

				$scope.onContentScrolling = function() {
					$scope.testOlderMessagesLoading();
				};

				/**
				 * This will handle callback functions after first messages are loaded
				 */
				$scope.afterInitLoad = function(messages) {
					_loadingOlderMessages = false;

					// start pulling new messages
					// $scope.scheduleNewMessagesLoading();

					$timeout(function() {
						// test if we are on bottom
						$scope.testOlderMessagesLoading(true);

						// when scrolled top, load older messages
						$(".nano-content", element).scroll($scope.onContentScrolling);
					});
				};

				$scope.hasSystemMessage = function(messages) {
					for (var i = messages.length - 1; i >= 0; i--) {
						if (!messages[i].author)
							return true;
					}
					return false;
				};

				$scope.getLastMessage = function(messages) {
					// find last message that is not system message
					for (var i = messages.length - 1; i >= 0; i--) {
						if (messages[i].author)
							return messages[i];
					}
					return false;
				};

				$scope.updateConversationInfo = function(messages, messagesCount) {
					var lastMessage = $scope.getLastMessage(messages);
					// if there is no non-system message, dont update
					if (!lastMessage)
						return false;

					// set info to conversation detail
					$scope.info.message = lastMessage;
					$scope.info.messages_count += messagesCount;

					// send info event upward
					$scope.$emit("conversationUpdated", $scope.info);
				};

				/**
				 * Schedule next pull of new messages
				 */
				$scope.scheduleNewMessagesLoading = function() {
					$timeout.cancel(_loadTimeoutPromise);
					_loadTimeoutPromise = $timeout($scope.loadNewMessages, _loadTimeout);
				};

				$scope.getLastMessageTime = function() {
					if (!$scope.messages || !$scope.messages.length)
						return undefined;

					return $scope.messages[$scope.messages.length - 1].created_at;
				};

				$scope.reloadConversationInfo = function() {
					Conversations.get({
						id: $scope.info._id,
						exclude_self: true
					}, function(res) {
						if ($scope.participants) $scope.loadParticipants();

						$scope.info.is_member = res.is_member;
						$scope.info.participants = res.participants;
						$scope.info.participants_count = res.participants_count;
						$scope.info.title = res.title;
						$scope.info = $scope.deserialize($scope.info);

						delete $scope.info.titlePersons;
						$scope.$emit("conversationDeepUpdate", $scope.info);
					});
				};

				/**
				 * Periodically pull new messages
				 */
				$scope.loadNewMessages = function() {
					if (_loadLock) return false;
					_loadLock = true;

					$scope.loadMessages({
							newer: $scope.getLastMessageTime(),
							no_read: true,
						},
						function(messages) {
							_loadLock = false;
							$scope.scheduleNewMessagesLoading();

							if (messages && messages.length) {

								if ($scope.hasSystemMessage(messages))
									$scope.reloadConversationInfo();

								$scope.testScrollBottom();
								$scope.updateConversationInfo(messages, messages.length);
							}
						}, true);
				};

				/**
				 * Scroll to bottom
				 */
				$scope.scrollBottom = function() {
					$timeout(function() {
						if ($(".nano-content", element).length > 0) {
							$(".nano-content", element).scrollTop($(".nano-content", element)[0].scrollHeight * 1000);
						}
					});
				};

				/**
				 * If user is on bottom, keep user there after added more content
				 */
				$scope.testScrollBottom = function() {
					var outer = $(".nano", element);
					var inner = $(".nano-content", outer);
					var pos = Math.ceil(inner.scrollTop() + inner.height());

					if (pos >= inner.prop('scrollHeight')) {
						$scope.scrollBottom();
					}
				};

				/**
				 * Send action request to archive/delete/leave conversation
				 * @param  {string} id       ID of conversation
				 * @param  {type} type     type of request DELETE/ARCHIVE/LEAVE
				 * @param  {resource} resource resource function to call
				 */
				$scope.sendActionRequest = function(id, type, resourceFunc) {
					if ($scope.sendingActionRequest) return false;
					$scope.sendingActionRequest = true;

					resourceFunc({
						id: id
					}, function(res) {
						$scope.sendingActionRequest = false;
						$scope.$emit("conversationRemoved", id);
						Notify.addSingleTranslate('NOTIFY.CONVERSATION_' + type + '_SUCCESS', Notify.T_SUCCESS);
					}, function(err) {
						$scope.sendingActionRequest = false;
						Notify.addSingleTranslate('NOTIFY.CONVERSATION_' + type + '_FAILED', Notify.T_ERROR);
					});
				};

				/**
				 * Transform conversation info so we can use it in view
				 */
				$scope.deserialize = function(conversation) {
					conversation.titleDetail = conversation.title;
					conversation.titleCustom = false;

					if (!conversation.title) {
						conversation.titleDetail = [];
						conversation.titleCustom = true;

						// use first three participants names if we dont have title
						for (var i = 0; i < 3 && i < conversation.participants.length; i++) {
							var user = conversation.participants[i];
							conversation.titleDetail.push(user.name);
						};
						conversation.titleDetail = conversation.titleDetail.join(", ");
					}

					return conversation;
				};

				/**
				 * Keep user on his position when added more messages to top
				 */
				$scope.scrollToCurrentPosition = function(done) {
					var content = $(".nano-content", element);
					var height = content.prop('scrollHeight');
					var scrollTop = content.scrollTop();

					$timeout(function() {
						$scope.$broadcast("scrollbarResize");
						$(".nano-content", element).scrollTop($(".nano-content", element).prop('scrollHeight') - height + scrollTop);

						done && done();
					});
				};

				$scope.setConversationAsReaded = function() {
					if (!$scope.info || $scope.info.read)
						return false;

					Messenger.decrUnreaded();
					$scope.info.read = true;
					Conversations.setReaded({
						id: $scope.info._id
					});

					$scope.$emit('currentConversationAsReaded');
				};

				/**
				 * Load oldermessages when we scrolled to top
				 */
				$scope.loadOlderMessages = function(loadOlderMessages) {
					if (_loadingOlderMessages || _loadOlderMessagesEnd || !$scope.messages.length) return false;
					_loadingOlderMessages = true;

					$scope.loadMessages({
						older: $scope.messages[0] ? $scope.messages[0].created_at : undefined
					}, function(messages) {
						_loadingOlderMessages = false;

						$scope.scrollToCurrentPosition(function() {});
						if (loadOlderMessages !== true) {
							$scope.setConversationAsReaded();
						}
					});
				};

				/**
				 * When we add new message callback
				 */
				$scope.onMessageAdded = function() {
					$scope.scrollBottom();
					$scope.loadNewMessages();
				};

				/**
				 * Resize box with timeout
				 * - this will let view to render first
				 */
				$scope.resizeTMessagesBox = function() {
					$timeout($scope.resizeMessagesBox);
				};

				$scope.resizeMessagesBox = function() {
					var container = $(".messages-container", element);
					var offset = -50;
					var measureContainer = $(".messages-container");

					if (ResponsiveViewport.isSmall()) {
						// box needs to be tall on mobile devices, so we count on whole-page-height
						measureContainer = $('#homepage-hero');
						offset = 0;
					}
					$scope.testScrollBottom();
					var maxBoxHeight = measureContainer.height() - element.find(".conversation-detail-top").outerHeight() - element.find(".messages-reply").outerHeight() + offset;
					container.css("max-height", maxBoxHeight);
					container.fadeIn();

					$(".nano-content", element).scroll($scope.onContentScrolling);

					$timeout(function() {
						// resize scrollbar
						$scope.$broadcast("scrollbarResize");
						$scope.$broadcast("classIfOverflowContentResize");
					});
				};

				// use sendActionRequest to delete conversation
				$scope.deleteConversation = function(id) {
					$scope.sendActionRequest(id, 'DELETE', Conversations.remove);
				};

				// use sendActionRequest to archive conversation
				$scope.archiveConversation = function(id) {
					$scope.sendActionRequest(id, 'ARCHIVE', Conversations.archive);
				};

				// use sendActionRequest to leave conversation
				$scope.leaveConversation = function(id) {
					$scope.sendActionRequest(id, 'LEAVE', Conversations.leave);
				};

				$scope.unreadConversation = function(info) {
					Conversations.setUnreaded({
						id: info._id
					}, function(res) {
						Messenger.incrUnreaded();
						info.read = false;
					});
				};

				/**
				 * Show/hide participants list & load from API
				 */
				$scope.toggleParticipants = function() {
					$scope.showParticipants = !$scope.showParticipants;
					$scope.resizeTMessagesBox();

					if ($scope.showParticipants && !$scope.participants)
						$scope.loadParticipants();
				};

				/**
				 * Load participants list
				 */
				$scope.loadParticipants = function() {
					Conversations.getParticipants({
						id: $scope.info._id,
						exclude_self: true
					}, function(res) {
						$scope.participants = res.participants;
						$scope.resizeTMessagesBox(); // resize with timeout
						$timeout(function() {
							$scope.$broadcast('scrollbarResize');
						});
					});
				};

				$scope.bindActionHandlers = function() {
					element.bind('click', function() {
						$scope.setConversationAsReaded();
					});

					element.bind('keypress', function() {
						$scope.setConversationAsReaded();
					});

					var ev = $scope.$on('scrollbarResize', function() {
						ev();

						$(".nano-content", element).bind('scroll mousedown wheel DOMMouseScroll mousewheel keyup', function(e) {
							if (e.which > 0 || e.type == "mousedown" || e.type == "mousewheel") {
								$scope.setConversationAsReaded();
							}
						});
					});
				};

				/**
				 * Config init variables deserialize conversation
				 * and load messages
				 */
				$scope.init = function(info) {

					$timeout.cancel(_loadTimeoutPromise);
					$scope.lockCounter++;
					// set initial state
					_loadOlderMessagesEnd = false;
					_scrollInited = false;
					$scope.messages = false;
					$scope.participants = false;
					$scope.showParticipants = false;
					$timeout($scope.bindActionHandlers);

					// load first messages and mark as readed on API based on actual state
					$scope.loadMessages(null, $scope.afterInitLoad, $scope.info.read);
				};

				$scope.deserializeInfo = function(info) {
					$scope.info = $scope.deserialize($scope.info);
					$scope.setTitle();
				};

				$scope.setTitle = function() {

					var title = ($scope.info.post) ? $translate.instant($scope.info.post.type_code) + ' ' + $scope.info.titleDetail : $scope.info.titleDetail;

					PageTitle.setTranslate('TITLE.messages.detail', title);
				};

				// resize box when needed
				$(window).resize($scope.resizeMessagesBox);
				$scope.$on("conversationReplyFormResized", $scope.resizeMessagesBox);


				$scope.$watch('updateTitle', $scope.setTitle);
				$scope.$watch('info', $scope.init);
				$scope.$watch('info', $scope.deserializeInfo, true);
				$scope.$on('loadNewMessages', $scope.loadNewMessages);
				$scope.$on('conversationMessageAdded', $scope.onMessageAdded);
				$scope.$on('$destroy', function() {
					// stop pulling new messages on directive destroy
					$timeout.cancel(_loadTimeoutPromise);
					$(window).off('resize', $scope.resizeMessagesBox);

				});
			}
		};
	}
]);