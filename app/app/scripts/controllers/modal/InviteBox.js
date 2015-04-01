'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.InviteBox
 * @description
 */

angular.module('hearth.controllers').controller('InviteBox', [
    '$scope', '$rootScope', 'Invitation', 'OpenGraph', 'Facebook', 'Notify', 'Validators',
    function($scope, $rootScope, Invitation, OpenGraph, Facebook, Notify, Validators) {
        $scope.showEmailForm = false;
        $scope.url = '';
        var timeoutClose = false;

        $scope.fbInvite = function() {
            Facebook.inviteFriends();
            return false;
        };

        $scope.showFinished = function() {

            $(".invite-form").slideToggle();
            timeoutClose = setTimeout(function() {
                $scope.closeThisDialog();
            }, 5000);
        };

        $scope.init = function() {
            var inviteInfo = OpenGraph.getDefaultInfo();
            var title = encodeURIComponent(inviteInfo.title);
            var description = encodeURIComponent(inviteInfo.description);

            $scope.url = window.location.href.replace(window.location.hash, '');
            $scope.urlLinkedin = $scope.url + '&title=' + title + '&summary=' + description;

            $scope.endpoints = $$config.sharingEndpoints;
        };

<<<<<<< HEAD
        function validateEmail(email) { 
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
            return email.trim().match(re);
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

=======
>>>>>>> feature/item-detail-ui-polish
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
            if(!Validators.emails(emails)) {

                $scope.showError.to_email = true;
                $scope.inviteForm.to_email.$error.format = true;
                return false;
            }
            return true;
        };

        $scope.validateInvitationForm = function(data) {
            var invalid = false;

            // is message filled?
            if($scope.inviteForm.message.$invalid) {
                invalid = $scope.showError.message = true;
            }

            if(!data.to_email || ! $scope.testEmailsFormat(data.to_email)) {
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
            $rootScope.globalLoading = false;

            if(res.ok) {
                $scope.showFinished();
            } else {
                Notify.addSingleTranslate('NOTIFY.EMAIL_INVITATION_FAILED', Notify.T_ERROR, ".invite-box-notify");
            }
        }

        $scope.sendEmailInvitation = function(data) {
            var dataOut;

            if(!$scope.validateInvitationForm(data))
                return false;

            $rootScope.globalLoading = true;
            // split emails to array and copy it to new object
            dataOut = $scope.transformInvitationOut(angular.copy(data));
            Invitation.add({invitation: dataOut}, handleEmailResult, handleEmailResult);
        };

        $scope.initForm = function() {
            angular.forEach($scope.showError, function(value, key) {
              $scope.showError[key] = false;
            });
            
            $("form.invite-form").show();
            $("div.invite-form").hide();
    
            if(timeoutClose)
                clearTimeout(timeoutClose);

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