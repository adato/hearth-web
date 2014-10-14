'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.Tutorial
 * @description
 */

angular.module('hearth.controllers').controller('InviteBox', [
    '$scope', '$rootScope', 'Invitation', 'OpenGraph', 'Facebook',
    function($scope, $rootScope, Invitation, OpenGraph, Facebook) {
        $scope.showEmailForm = false;
        $scope.url = '';
        $scope.inv = {
            text: '',
            addrs: '',
        };

        function handleResult(res) {
            console.log(res);
            alert("OK");
        }

        $scope.fbInvite = function() {
            Facebook.inviteFriends();
            return false;
        }

        $scope.init = function() {
            var inviteInfo = OpenGraph.getDefaultInfo();
            var title = encodeURIComponent(inviteInfo.title);
            var description = encodeURIComponent(inviteInfo.description);

            $scope.url = window.location.href.replace(window.location.hash, '');
            $scope.urlLinkedin = $scope.url + '&title=' + title + '&summary=' + description;

            $scope.endpoints = $$config.sharingEndpoints;
        };


        $scope.validateInvitationForm = function(data) {
            return false;
        };
        
        $scope.sendEmailInvitation = function() {
            Invitation.add($scope.inv, handleResult);
        };

        // function will show or hide email form
        $scope.toggleEmailForm = function() {
            $scope.showEmailForm = !$scope.showEmailForm;
        };

        $scope.$on('initFinished', $scope.init);
        $rootScope.initFinished && $scope.init();
    }
]);