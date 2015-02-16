'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ConfirmEmailCtrl
 * @description 
 */
 
angular.module('hearth.controllers').controller('ConfirmEmailCtrl', [
	'$scope', '$location', 'Auth', '$analytics', 'Notify',
	function($scope, $location, Auth, $analytics, Notify) {
		var search;
		$scope.brokenLink = false;
		search = $location.search();
	
		function onError(res) {
			$analytics.eventTrack('registration email failed', {
				category: 'registration',
				label: 'registration email failed'
			});

			if(res.name && res.name == 'ValidationError')
				return $scope.brokenLink = true;
			else
				Notify.addSingleTranslate('NOTIFY.ACCOUNT_ACTIVATE_FAILED', Notify.T_ERROR, '.activate-account-notify-container');
		}

		function onSuccess(res) {
			// flash.success = 'EMAIL_CONFIRMATION_SUCCESS';
			$analytics.eventTrack('registration email confirmed', {
				category: 'registration',
				label: 'registration email confirmed'
			});
			Notify.addSingleTranslate('NOTIFY.ACCOUNT_ACTIVATE_SUCCESS', Notify.T_SUCCESS);
			return $location.path('login');
		}
		
		if(!search.hash)
			$scope.brokenLink = true;
		else
			Auth.confirmRegistration(search.hash, onSuccess, onError);
	}
]);