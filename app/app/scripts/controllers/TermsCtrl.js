// ========================= DEPRECATED =======================
// 'use strict';

// /**
//  * @ngdoc controller
//  * @name hearth.controllers.TermsCtrl
//  * @description
//  */

// angular.module('hearth.controllers').controller('TermsCtrl', [
// 	'$scope', 'LanguageSwitch', '$rootScope',
// 	function($scope, LanguageSwitch, $rootScope) {
// 		$scope.showButton = true;
// 		$scope.termsPath = false;

// 		var updateTermsPath = function() {

// 			return $scope.termsPath = 'locales/' + LanguageSwitch.uses().code + '/terms.html';
// 		};
// 		$scope.$watch(function() {
// 			return LanguageSwitch.uses();
// 		}, updateTermsPath);
		
// 		$rootScope.$on("languageInited", updateTermsPath);
// 		if($rootScope.languageInited) {
// 			updateTermsPath();
// 		}

// 	}
// ]);