'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.Tutorial
 * @description
 */

angular.module('hearth.controllers').controller('InviteBox', [
    '$scope', '$rootScope', 'Invitation', 'OpenGraph', 'Facebook', 'Notify',
    function($scope, $rootScope, Invitation, OpenGraph, Facebook, Notify) {
        $scope.showEmailForm = false;
        $scope.url = '';

        $scope.fbInvite = function() {
            Facebook.inviteFriends();
            return false;
        };

        $scope.init = function() {
            var inviteInfo = OpenGraph.getDefaultInfo();
            var title = encodeURIComponent(inviteInfo.title);
            var description = encodeURIComponent(inviteInfo.description);

            $scope.url = window.location.href.replace(window.location.hash, '');
            $scope.urlLinkedin = $scope.url + '&title=' + title + '&summary=' + description;

            $scope.endpoints = $$config.sharingEndpoints;
        };

        function validateEmail(email) { 
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
            return email.match(re);
        }

        $scope.validateEmails = function(emails) {
            var valid = true;
            // are given emails valid?
            jQuery.each(emails, function(key, email) {

                // this will set false to valid and call break when not valid
                return valid = !!validateEmail(email);
            });
            return valid;
        };

        /**
         * This function will test given emails and if they are wrong
         * it will show error and return false
         */
        $scope.testEmailsFormat = function(data) {
            var emails = data;
            $scope.inviteForm.to_email.$error.format = false; 

            if(!data) return false;

            // if emails are not array, split it by comma
            if(!angular.isArray(emails)) {
                emails = angular.copy(emails).split(",");
            }
            // validate emails 
            if(!$scope.validateEmails(emails)) {

                $scope.showError.to_email = true;
                $scope.inviteForm.to_email.$error.format = true;
                return false
            }
            return true;
        };

        $scope.validateInvitationForm = function(data) {
            var invalid = false;

            // is message filled?
            if($scope.inviteForm.message.$invalid) {
                invalid = $scope.showError.message = true;
            }

            // is to_email illed?
            if($scope.inviteForm.to_email.$invalid) {
                invalid = $scope.showError.to_email = true;
            }
            
            if(data.to_email && ! $scope.testEmailsFormat(data.to_email)) {
                invalid = true;
            }

            return !invalid;
        };
        
        $scope.transformInvitationOut = function(data) {
            
            if(data.to_email) {
                data.to_email = data.to_email.split(",");
            }

            return data;
        };

        function handleEmailResult(res) {
            if(res.ok) {

                Notify.addTranslate('NOTIFY.EMAIL_INVITATION_SUCCESS', Notify.T_SUCCESS);
                $scope.closeThisDialog();
            } else {
                Notify.hideAll(".invite-box-notify", function() {
                    Notify.addTranslate('NOTIFY.EMAIL_INVITATION_FAILED', Notify.T_ERROR, ".invite-box-notify");
                });
            }
        }

        $scope.sendEmailInvitation = function(data) {
            var dataOut;

            if(!$scope.validateInvitationForm(data))
                return false;

            // split emails to array and copy it to new object
            dataOut = $scope.transformInvitationOut(angular.copy(data));
            Invitation.add({invitation: dataOut}, handleEmailResult);
        };

        $scope.initForm = function() {
            angular.forEach($scope.showError, function(value, key) {
              $scope.showError[key] = false;
            });
            
            $scope.inv = {
                message: '',
                to_email: '',
            };

            $scope.showError = {
                message: false,
                to_email: false,
            };

            $scope.sent = false;
        };

        // function will show or hide email form
        $scope.toggleEmailForm = function() {
            $scope.initForm();
            $scope.showEmailForm = !$scope.showEmailForm;
        };

        $scope.$on('initFinished', $scope.init);
        $rootScope.initFinished && $scope.init();
    }
]);