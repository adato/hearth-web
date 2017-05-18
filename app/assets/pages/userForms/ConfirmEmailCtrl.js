'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ConfirmEmailCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ConfirmEmailCtrl', [
	'$scope', '$location', 'Auth', '$analytics', 'Notify', 'LanguageSwitch', 'User',
	function($scope, $location, Auth, $analytics, Notify, LanguageSwitch, User) {
		$scope.brokenLink = false;

		init();

		function init() {
			checkHash($location.search());
		}

		function checkHash(search) {
			if (!search.hash) return $scope.brokenLink = true;

			User.confirmRegistration({hash: search.hash}, res => {
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
			}, err => {
				$analytics.eventTrack('registration email failed', {
					category: 'registration',
					label: 'registration email failed'
				});

				if (res && res.data && res.data.name == 'ValidationError')
					return $scope.brokenLink = true;
			});
		}

	}
]);