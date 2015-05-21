'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.conversationAdd
 * @description Form for new conversation
 * @restrict E
 */
angular.module('hearth.directives').directive('conversationAdd', [
    '$rootScope', 'Conversations', 'Notify',
    function($rootScope, Conversations, Notify) {
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
                $scope.showError = {
                    text: false,
                    participant_ids: false,
                };
                $scope.message = {
                    participant_ids: [],
                    title: '',
                    text: '',
                };

                $scope.hideRecipientsError = function() {
                    $scope.showError.participant_ids = false;
                };
                
                $scope.showRecipientsError = function() {
                    if(!$scope.message.participant_ids.length)
                        $scope.showError.participant_ids = true;
                };
                
                $scope.isValid = function(msg) {
                    var invalid = false;

                    // if there is presetted recipient, add him to list
                    if($scope.recipient) {
                        msg.participant_ids = [$scope.recipient];

                    // else test if there are selected recipients
                    } else if(!msg.participant_ids.length) {
                        invalid = $scope.showError.participant_ids = true;
                    }

                    if($scope.addMessageForm.text.$invalid)
                        invalid = $scope.showError.text = true;
                    return !invalid;
                };

                $scope.serialize = function(msg) {
                    msg.participant_ids = msg.participant_ids.map(function(item){ return item._id});
                    return msg;
                };

                /**
                 * Validate message and send to API
                 */
                $scope.addMessage = function(msg) {
                    if(!$scope.isValid(msg))
                        return false;

                    var data = $scope.serialize(angular.copy(msg));

                    if($scope.sendMessage) return false;
                    $scope.sendMessage = true;

                    Conversations.add(data, function(res) {

                        $scope.sendMessage = false;

                        if($scope.onSuccess)
                            $scope.onSuccess(res);
                        else
                            Notify.addSingleTranslate('NOTIFY.MESSAGE_SEND_SUCCESS', Notify.T_SUCCESS);
                            
                        $scope.$emit("conversationCreated", res);
                        $scope.close(res);
                    }, function(err) {
                        $scope.sendMessage = false;
                        
                        if($scope.onError)
                            $scope.onError(err);
                        else
                            Notify.addSingleTranslate('NOTIFY.MESSAGE_SEND_FAILED', Notify.T_ERROR);
                    });
                };
            }
        };
    }
]);