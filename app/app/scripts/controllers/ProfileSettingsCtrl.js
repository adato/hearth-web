'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileSettingsCtrl
 * @description
 * 
 * @deprecated
 */

angular.module('hearth.controllers').controller('ProfileSettingsCtrl', [
	'$scope', 'UsersService', 'LanguageSwitch', '$rootScope', '$route',
	function($scope, UsersService, LanguageSwitch, $rootScope, $route) {
		$scope.loaded = true;
		$scope.pass = {
			old: '',
			changed: ''
		}
		
		function init() {

			$scope.lang = LanguageSwitch.uses();
		}

		$scope.switchLang = function(lang) {

			LanguageSwitch.swicthTo(lang);
			window.location.reload();
		}


		$scope.$on('initFinished', init);
		$rootScope.initFinished && init();
	}
]);