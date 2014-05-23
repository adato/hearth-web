'use strict';

angular.module('hearth.controllers').controller('RegisterCtrl', [
	'$scope', 'LanguageSwitch', 'User', 'ResponseErrors', '$analytics', 'Auth', '$location',
	function($scope, LanguageSwitch, User, ResponseErrors, $analytics, Auth, $location) {
		if (Auth.isLoggedIn()) {
			$location.path('profile/' + Auth.getCredentials()._id);
			return;
		}
		$scope.sent = false;
		$scope.sending = false;
		$scope.user = new User();
		$scope.errors = new ResponseErrors();
		$scope.register = function() {
			if (!$scope.registerForm.$valid) {
				return;
			}
			$scope.errors = new ResponseErrors();
			$scope.user.language = LanguageSwitch.uses();
			$scope.sending = true;
			return $scope.user.$save(function() {
				$scope.sent = true;
				$scope.sending = false;
				return $analytics.eventTrack('registration email sent', {
					category: 'registration',
					label: 'registration email sent'
				});
			}, function(err) {
				$scope.errors = new ResponseErrors(err);
				$scope.sent = false;
				$scope.sending = false;
				return $analytics.eventTrack('error during registration', {
					category: 'registration',
					label: 'error during registration'
				});
			});
		};
	}
]);