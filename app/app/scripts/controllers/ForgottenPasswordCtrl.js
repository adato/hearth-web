'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ForgottenPasswordCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ForgottenPasswordCtrl', [
    '$scope', 'Auth', '$location', '$translate', 'ResponseErrors', 'Email',
    function($scope, Auth, $location, $translate, ResponseErrors, Email) {
        $scope.sent = false;
        $scope.data = {
            email: ''
        };
        $scope.showError = {
            email: false
        };

        $scope.errors = new ResponseErrors();
        
        $scope.testEmailExists = function(email, form, inputName, cb) {

            $scope[form][inputName].$error.unknown = false;
            // dont check when email is blank
            if (!email) return false;

            // Check if email is in our DB
            Email.exists({email: email}, function(res) {
                if (!res.ok) {
                   
                    // show error when email does not exist
                    $scope.showError.email = true;
                    $scope[form][inputName].$error.unknown = true;
                }
                // call callbeck
                cb && cb(res.ok);
            });
        };

        $scope.validateEmail = function(form, cb) {
            $scope.showError.email = true;
            // if form is not valid, return false
            if ($scope.resetPasswordForm.email.$invalid) {
                cb && cb(false);
            } else {
                // else test if email exists
                $scope.testEmailExists(form.email, 'resetPasswordForm', 'email',cb);
            }
        };

        $scope.resetPassword = function() {
            // is email valid?
            $scope.validateEmail($scope.data, function(res) {
                if(!res) return false;

                if ($scope.sending) return false;
                $scope.sending = true;

                return Auth.requestPasswordReset($scope.data.email).success(function() {
                    $scope.sent = true;
                    $scope.sending = false;

                }).error(function(data, status) {
                    $scope.sending = false;
                    console.log(data, status);
                });
            });
        };

        $(".fg_email").focus();
    }
]);