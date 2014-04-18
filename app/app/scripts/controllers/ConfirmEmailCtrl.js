'use strict';

angular.module('hearth.controllers').controller('ConfirmEmailCtrl', [
	'$scope', '$location', 'Auth', 'flash', '$analytics',
	function($scope, $location, Auth, flash, $analytics) {
		var search;
		$scope.hashIsValid = false;
		$scope.loaded = false;
		$scope.missingHash = true;
		search = $location.search();
		if (search.hash) {
			$scope.missingHash = false;
			return Auth.confirmRegistration(search.hash, function(data) {
				flash.success = 'EMAIL_CONFIRMATION_SUCCESS';
				$analytics.eventTrack('registration email confirmed', {
					category: 'registration',
					label: 'registration email confirmed'
				});
				return $location.path('login');
			}, function(res) {
				flash.error = 'EMAIL_CONFIRMATION_FAILURE';
				$analytics.eventTrack('registration email failed', {
					category: 'registration',
					label: 'registration email failed'
				});
				return $scope.loaded = true;
			});
		}
	}
]);