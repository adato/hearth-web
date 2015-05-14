'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.conversationDetail
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('conversationDetail', [
    '$rootScope', 'Conversations', '$timeout', 'Notify', 'Viewport',
    function($rootScope, Conversations, $timeout, Notify, Viewport) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                info: '=',
            },
            templateUrl: 'templates/directives/conversationDetail.html',
            link: function($scope, element) {
                $scope.getProfileLinkByType = $rootScope.getProfileLinkByType;
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
                var _loadTimeout = 20000; // pull requests interval in ms
                var _loadLock = false; // pull requests interval in ms
                var _scrollInited = false;
                var _loadOlderMessagesEnd = false;
                var _loadTimeoutPromise = false;
                var _loadingOlderMessages = false;
                
                $scope.addMessagesToList = function(messages, append) {
                    // concat new messages
                    if(!$scope.messages)
                        $scope.messages = messages;
                    else if(append)
                        $scope.messages = $scope.messages.concat(messages);
                    else
                        Array.prototype.unshift.apply($scope.messages, messages);

                    // and resize message box
                    $scope.resizeTMessagesBox();

                    // resize scrollbar
                    $scope.$broadcast("scrollbarResize");
                    $scope.$broadcast("classIfOverflowContentResize");

                    // when we get less messages then requested, we hitted the end of list
                    if(!append && messages.length < _messagesCount)
                        _loadOlderMessagesEnd = true;
                };

                /**
                 * Load messages 
                 * @param  {[type]}   from [description]
                 * @param  {Function} done [description]
                 * @return {[type]}        [description]
                 */
                $scope.loadMessages = function(config, done) {
                    var lockCounter = $scope.lockCounter;
                    config = angular.extend(config || {}, {
                        id: $scope.info._id,
                        limit: _messagesCount
                    });
                    Conversations.getMessages(
                        config,
                        function(res) {
                            // test if we loaded data for actual conversation detail
                            // if(config.id !== $scope.info._id) return false;
                            if(lockCounter !== $scope.lockCounter) return false;

                            // append/prepend messages
                            res.messages.length && $scope.addMessagesToList(res.messages, config.newer);

                            done && done(res.messages);
                        }, done);
                };

                $scope.testOlderMessagesLoading = function() {
                    if($(".nano-content", element).scrollTop() < 100)
                        $scope.loadOlderMessages();
                };
                
                /**
                 * This will handle callback functions after first messages are loaded
                 */
                $scope.afterInitLoad = function(messages) {
                    _loadingOlderMessages = false;

                    // start pulling new messages
                    $scope.scheduleNewMessagesLoading();

                    $timeout(function() {
                        // test if we are on bottom
                        $scope.testOlderMessagesLoading();

                        // when scrolled top, load older messages
                        $(".nano-content", element).scroll($scope.testOlderMessagesLoading);
                    });
                };

                $scope.hasSystemMessage = function(messages) {
                    for(var i = messages.length - 1; i >= 0; i--) {
                        if(!messages[i].author)
                            return true;
                    }
                    return false;
                };

                $scope.getLastMessage = function(messages) {
                    // find last message that is not system message
                    for(var i = messages.length - 1; i >= 0; i--) {
                        if(messages[i].author)
                            return messages[i];
                    }
                    return false;
                };
                
                $scope.updateConversationInfo = function(messages, messagesCount) {
                    var lastMessage = $scope.getLastMessage(messages);
                    // if there is no non-system message, dont update
                    if(!lastMessage)
                        return false;

                    // set info to conversation detail
                    $scope.info.last_message_time = lastMessage.created_at;
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
                    if(!$scope.messages || !$scope.messages.length)
                        return undefined;
                    
                    return $scope.messages[$scope.messages.length-1].created_at;
                };

                $scope.reloadConversationInfo = function() {
                    Conversations.get({id: $scope.info._id, exclude_self: true}, function(res) {
                        $scope.info.participants = res.participants;
                        $scope.info.participants_count = res.participants_count;
                        $scope.info.title = res.title;
                        if($scope.participants) $scope.loadParticipants();
                        $scope.info = $scope.deserialize($scope.info);

                        $scope.$emit("conversationDeepUpdate", $scope.info);
                    });
                };

                /**
                 * Periodically pull new messages
                 */
                $scope.loadNewMessages = function() {
                    if(_loadLock) return false;
                    _loadLock = true;

                    $scope.loadMessages({
                            newer: $scope.getLastMessageTime()
                        }, 
                        function(messages) {
                            _loadLock = false;
                            $scope.scheduleNewMessagesLoading();

                            if(messages && messages.length) {

                                if($scope.hasSystemMessage(messages))
                                    $scope.reloadConversationInfo();

                                $scope.testScrollBottom();
                                $scope.updateConversationInfo(messages, messages.length);
                            }
                        });
                };

                /**
                 * Scroll to bottom
                 */
                $scope.scrollBottom = function() {
                    $timeout(function() {
                        $(".nano-content", element).scrollTop($(".nano-content")[0].scrollHeight * 1000);
                    });
                };

                /**
                 * If user is on bottom, keep user there after added more content
                 */
                $scope.testScrollBottom = function() {
                    var outer = $(".nano", element);
                    var inner = $(".nano-content", outer);
                    
                    if(inner.scrollTop() + inner.height() >= inner.prop('scrollHeight')) {
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
                    if($scope.sendingActionRequest) return false;
                    $scope.sendingActionRequest = true;
                    
                    resourceFunc({id: id}, function(res) {
                        $scope.sendingActionRequest = false;
                        $scope.$emit("conversationRemoved", id);
                        Notify.addSingleTranslate('NOTIFY.CONVERSATION_'+type+'_SUCCESS', Notify.T_SUCCESS);
                    }, function(err) {
                        $scope.sendingActionRequest = false;
                        Notify.addSingleTranslate('NOTIFY.CONVERSATION_'+type+'_FAILED', Notify.T_ERROR);
                    });
                };
                
                /**
                 * Transform conversation info so we can use it in view
                 */
                $scope.deserialize = function(conversation) {
                    if(!conversation.title) {
                        conversation.titleDetail = [];

                        // use first three participants names if we dont have title
                        for(var i = 0; i < 3 && i < conversation.participants.length; i++) {
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

                /**
                 * Load oldermessages when we scrolled to top
                 */
                $scope.loadOlderMessages = function() {
                    if(_loadingOlderMessages|| _loadOlderMessagesEnd || !$scope.messages.length) return false;
                    _loadingOlderMessages = true;

                    $scope.loadMessages({
                            older: $scope.messages[0] ? $scope.messages[0].created_at : undefined
                        }, function(messages) {
                            _loadingOlderMessages = false;

                            $scope.scrollToCurrentPosition(function() {
                            });
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

                    $scope.testScrollBottom();
                    var maxBoxHeight = $(".messages-container").height() - element.find(".conversation-detail-top").outerHeight() - element.find(".messages-reply").outerHeight() - 50;
                    
                    container.css("max-height", maxBoxHeight);
                    container.css("height", $(".nano-content", element).prop('scrollHeight'));
                    container.fadeIn();

                    $(".nano-content", element).scroll($scope.testOlderMessagesLoading);
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

                /**
                 * Show/hide participants list & load from API
                 */
                $scope.toggleParticipants =  function() {
                    $scope.showParticipants = ! $scope.showParticipants;
                    $scope.resizeTMessagesBox();

                    if($scope.showParticipants && !$scope.participants)
                        $scope.loadParticipants();
                };

                /**
                 * Load participants list
                 */
                $scope.loadParticipants = function() {
                    Conversations.getParticipants({id: $scope.info._id, exclude_self: true}, function(res) {
                        $scope.participants = res.participants;
                        $scope.resizeTMessagesBox(); // resize with timeout
                        $timeout(function() {
                            $scope.$broadcast('scrollbarResize');
                        });
                    });
                };

                /**
                 * Config init variables deserialize conversation
                 * and load messages
                 */
                $scope.init = function(info) {
                    // if(_loadingOlderMessages)
                    //     return false;
                    // _loadingOlderMessages = true;
                        
                    $timeout.cancel(_loadTimeoutPromise);
                    $scope.lockCounter++;
                    // set initial state
                    $scope.info = $scope.deserialize($scope.info);
                    _loadOlderMessagesEnd = false;
                    _scrollInited = false;
                    $scope.messages = false;
                    $scope.participants = false;
                    $scope.showParticipants = false;

                    // load first messages
                    $scope.loadMessages(null, $scope.afterInitLoad);
                };

                // resize box when needed
                $(window).resize($scope.resizeMessagesBox);
                $scope.$on("messageReplyFormResized", $scope.resizeMessagesBox);

                $scope.$watch('info', $scope.init);
                $scope.$on('conversationMessageAdded', $scope.onMessageAdded);
                $scope.$on('$destroy', function() {
                    // stop pulling new messages on directive destroy
                    $timeout.cancel(_loadTimeoutPromise);
                });
            }
        };
    }
]);