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

		$scope.deleteAccount = function() {
			
		};

		$scope.changePassword = function() {
			
		};

		$scope.init = function () {

			$scope.lang = LanguageSwitch.uses();
		};

		$scope.switchLang = function(lang) {

			LanguageSwitch.swicthTo(lang);
			window.location.reload();
		};


		$scope.$on('$scope.initFinished', $scope.init);
		$rootScope.$scope.initFinished && $scope.init();
	}
]);