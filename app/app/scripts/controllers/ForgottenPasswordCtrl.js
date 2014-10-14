'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ForgottenPasswordCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ForgottenPasswordCtrl', [
    '$scope', 'Auth', '$location', '$translate', 'ResponseErrors',
    function($scope, Auth, $location, $translate, ResponseErrors) {
        $scope.sent = false;
        $scope.data = {
            email: ''
        };
        $scope.showError = {
            email: false
        };

        $scope.errors = new ResponseErrors();

        $scope.validateData = function(form) {
            var invalid = false;

            if ($scope.resetPasswordForm.email.$invalid) {
                invalid = $scope.showError.email = true;
            }

            return !invalid;
        };

        $scope.resetPassword = function() {
            // is form valid?
            if (!$scope.validateData($scope.data))
                return false;

            if($scope.sending) return false;
            $scope.sending = true;
            
            return Auth.requestPasswordReset($scope.data.email).success(function() {
                $scope.sent = true;
            	$scope.sending = false;;
            }).error(function(data, status) {
            	$scope.sending = false;;
                console.log(data, status);
            });
        };
    }
]);