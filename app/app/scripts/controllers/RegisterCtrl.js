'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.RegisterCtrl
 * @description
 */

angular.module('hearth.controllers').controller('RegisterCtrl', [
    '$scope', '$rootScope', 'LanguageSwitch', 'User', 'ResponseErrors', '$analytics', 'Auth', '$location', 'Email',
    function($scope, $rootScope, LanguageSwitch, User, ResponseErrors, $analytics, Auth, $location, Email) {

        $scope.user = new User();
        $scope.sent = false; // show result msg
        $scope.sending = false; // lock - send user only once
        $scope.termsPath = false;

        $scope.apiErrors = {};
        $scope.showError = {
            topError: false,
            name: false,
            email: false,
            password: false,
        };

        $scope.checkEmailExists = function(email, form, inputName, cb) {

            $scope[form][inputName].$error.used = false;
            $scope.apiErrors.email = false;
            
            // dont check when email is invalid
            if ($scope[form][inputName].$invalid)
                return false;

            // Check if email is in our DB
            Email.exists({email: email}, function(res) {
                if (res.exists) {
                   
                    // show error when email does not exist
                    $scope.showError.email = true;
                    $scope[form][inputName].$error.used = true;
                }
                // call callbeck
                cb && cb(res.exists);
            });
        };

        $scope.validateData = function(user) {
            var invalid = false;

            if ($scope.registerForm.name.$invalid) {
                invalid = $scope.showError.name = true;
            }

            if ($scope.registerForm.email.$invalid) {
                invalid = $scope.showError.email = true;
            }

            if ($scope.registerForm.password.$invalid) {
                invalid = $scope.showError.password = true;
            }

            return !invalid;
        };

        // no api endpoint for this reuqest yet        
        // $scope.checkUsedEmail = function(email, cb) {
        //     cb(false);
        // };

        // when registration is successfull - hide form and show success message
        $scope.hideForm = function() {
            $(".register-login-form").fadeOut('slow', function() {
                $(".register-successful").fadeIn('slow', function() {});
            });
        };

        $scope.sendRegistration = function(user) {

            $scope.registerForm.email.$error.used = false;
            $scope.showError.topError = false;

            // lock - dont send form twice
            if ($scope.sending) return false;
            $scope.sending = true;

            return $scope.user.$save(function() {

                $scope.sent = true;
                $scope.sending = false;
                $scope.hideForm();
                return $analytics.eventTrack('registration email sent', {
                    category: 'registration',
                    label: 'registration email sent'
                });

            }, function(err) {
                $scope.sending = false;
                $scope.showError.topError = true;
                $scope.apiErrors = new ResponseErrors(err);
                if ($scope.apiErrors.email)
                    $scope.showError.email = true;

                return $analytics.eventTrack('error during registration', {
                    category: 'registration',
                    label: 'error during registration'
                });
            });
        };

        $scope.register = function(user) {
            user.language = LanguageSwitch.uses();

            if (!$scope.validateData(user)) return false;

            // $scope.checkUsedEmail(user.email, function(isUsed) {
            //     if (isUsed) {
            //         $scope.registerForm.email.$error.used = true;
            //         return $scope.showError.email = true;
            //     }

            $scope.sendRegistration(user);
            // });
        };

        $scope.init = function() {
            if (Auth.isLoggedIn()) {
                return $location.path($rootScope.referrerUrl || 'profile/' + Auth.getCredentials()._id);
            }
            $scope.termsPath = '/locales/' + LanguageSwitch.uses().code + '/terms.html';
        };

        $scope.$on('initFinished', $scope.init);
        $rootScope.initFinished && $scope.init();
    }
]);