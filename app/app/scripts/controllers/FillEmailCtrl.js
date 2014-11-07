'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.FillEmailCtrl
 * @description 
 */

angular.module('hearth.controllers').controller('FillEmailCtrl', [
    '$scope', 'Auth', '$location', 'ResponseErrors', 'Email', 'Notify',
    function($scope, Auth, $location, ResponseErrors, Email, Notify) {
		$scope.data = {
            email: ''
        };
        $scope.showError = {
            email: false
        };

        $scope.errors = new ResponseErrors();
        
        $scope.testEmailExists = function(email, form, inputName, cb) {

            $scope[form][inputName].$error.used = false;
            // dont check when email is blank
            if (!email) return false;

            // Check if email is in our DB
            Email.exists({email: email}, function(res) {
                if (res.ok) {
                    // show error when email does not exist
                    $scope.showError.email = true;
                    $scope[form][inputName].$error.used = true;
                }
                // call callbeck
                cb && cb(res.ok);
            }, function(res) {
	        	if(res.ok) {
	                $scope.showError.email = true;
	                $scope[form][inputName].$error.used = true;
                	return cb && cb(true);
	        	}
	        	
                cb && cb(false);
            });
        };

        $scope.validateEmail = function(form, cb) {
            $scope.showError.email = true;
            // if form is not valid, return false
            if ($scope.fillEmailForm.email.$invalid) {
                cb && cb(false);
            } else {
                // else test if email exists
                $scope.testEmailExists(form.email, 'fillEmailForm', 'email',cb);
            }
        };

        $scope.fillEmail = function() {

            if ($scope.sending)
                return false;
            $scope.sending = true;

            // is email valid?
            $scope.validateEmail($scope.data, function(res) {
                if(res) {
                	
                    $scope.sending = false;
                	return false;
                }

                // return Auth.requestPasswordReset($scope.data.email).success(function() {
                //     $scope.sending = false;
                //     Notify.addSingleTranslate('NOTIFY.RESET_PASSWORD_SUCCESS', Notify.T_SUCCESS);
                //     $location.url("/login");

                // }).error(function(data, status) {
                    $scope.sending = false;
                    Notify.addSingleTranslate('NOTIFY.RESET_PASSWORD_FAILED', Notify.T_ERROR, '.fill-email-notify-container');
                // });
            });
        };
	}
]);