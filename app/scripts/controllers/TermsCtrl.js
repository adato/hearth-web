'use strict';

angular.module('hearth.controllers').controller('TermsCtrl', [
	'$scope', 'LanguageSwitch',
	function($scope, LanguageSwitch) {
		$scope.showButton = true;
		var updateTermsPath;
		updateTermsPath = function() {
			return $scope.termsPath = '../locales/' + LanguageSwitch.uses() + '/terms.html';
		};
		$scope.$watch(function() {
			return LanguageSwitch.uses();
		}, updateTermsPath);
		return updateTermsPath();
	}
]);