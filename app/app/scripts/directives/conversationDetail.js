'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.conversationDetail
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('conversationDetail', [
    '$rootScope', 'Conversations', '$timeout',
    function($rootScope, Conversations, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                info: '=',
            },
            templateUrl: 'templates/directives/conversationDetail.html',
            link: function($scope, element) {
                $scope.getProfileLinkByType = $rootScope.getProfileLinkByType;

                $scope.messages = false;
                var _messagesCount = 10; // how many messages will we load in each request except new messages
                var _loadTimeout = 10000; // pull requests interval in ms
                var _loadLock = false; // pull requests interval in ms
                var _loadTimeoutPromise = false;
                
                $scope.loadMessages = function(from) {
                    if(_loadLock) return false;
                    _loadLock = true;
                                        
                    Conversations.getMessages({id: $scope.info._id, from: from, count: _messagesCount}, function(res) {
                        $scope.messages = res.messages.slice().reverse();
                        _loadTimeoutPromise = $timeout($scope.loadNewMessages, _loadTimeout);
                        _loadLock = false;
                    }, function() {
                        _loadLock = false;
                        _loadTimeoutPromise = $timeout($scope.loadNewMessages, _loadTimeout);
                    });
                };
                
                $scope.loadNewMessages = function() {
                    if(!$scope.messages.length)
                        return $scope.loadMessages();

                    if(_loadLock) return false;
                    _loadLock = true;

                    var config = {
                        id: $scope.info._id,
                        newer: $scope.messages[$scope.messages.length-1].created_at,
                    };

                    $timeout.cancel(_loadTimeoutPromise);
                    Conversations.getMessages(config, function(res) {
                        _loadTimeoutPromise = $timeout($scope.loadNewMessages, _loadTimeout);
                        _loadLock = false;
                        
                        $scope.messages = $scope.messages.concat(res.messages.reverse());
                    }, function() {
                        _loadLock = false;
                        _loadTimeoutPromise = $timeout($scope.loadNewMessages, _loadTimeout);
                    });
                };
                
                $scope.init = function(info) {
                    $timeout.cancel(_loadTimeoutPromise);

                    $scope.conversation = false;
                    $scope.loadMessages();
                };

                $scope.$watch('info', $scope.init);
                $scope.$on('conversationMessageAdded', $scope.loadNewMessages);
                $scope.$on('$destroy', function() {
                    // stop pulling new messages on directive destroy
                    $timeout.cancel(_loadTimeoutPromise);
                });
            }
        };
    }
]);