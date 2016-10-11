'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ConfirmEmailCtrl
 * @description 
 */

angular.module('hearth.controllers').controller('ConfirmEmailCtrl', [
	'$scope', '$location', 'Auth', '$analytics', 'Notify', 'LanguageSwitch',
	function($scope, $location, Auth, $analytics, Notify, LanguageSwitch) {
		var search;
		$scope.brokenLink = false;
		search = $location.search();

		function onError(res) {
			$analytics.eventTrack('registration email failed', {
				category: 'registration',
				label: 'registration email failed'
			});

			if (res && res.data && res.data.name == 'ValidationError')
				return $scope.brokenLink = true;
		}

		function onSuccess(res) {
			if (res.language)
				LanguageSwitch.setCookie(res.language);

			$analytics.eventTrack('registration email confirmed', {
				category: 'registration',
				label: 'registration email confirmed'
			});

			Notify.addTranslateAfterRefresh('NOTIFY.ACCOUNT_ACTIVATE_SUCCESS', Notify.T_SUCCESS);
			Auth.setToken(res.api_token);
			window.location = $$config.appUrl;
			return true;
		}

		if (!search.hash)
			$scope.brokenLink = true;
		else
			Auth.confirmRegistration(search.hash, onSuccess, onError);
	}
]);