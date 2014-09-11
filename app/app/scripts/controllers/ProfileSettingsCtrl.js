'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileSettingsCtrl
 * @description
 * 
 * @deprecated
 */

angular.module('hearth.controllers').controller('ProfileSettingsCtrl', [
	'$scope', 'UsersService', 'LanguageSwitch', '$rootScope',
	function($scope, UsersService, LanguageSwitch, $rootScope) {
		$scope.loaded = true;
		$scope.pass = {
			old: '',
			changed: ''
		}
		
		function init() {

			$scope.lang = LanguageSwitch.uses();
			console.log($scope.lang);
		}



		$scope.$on('initFinished', init);
		$rootScope.initFinished && init();
	}
]);