'use strict';

angular.module('hearth.controllers').controller('TermsCtrl', [
	'$scope', 'LanguageSwitch',
	function($scope, LanguageSwitch) {
		var updateTermsPath = function() {
			$scope.termsPath = '../locales/' + LanguageSwitch.uses() + '/terms.html';
			return $scope.termsPath;
		};
		$scope.$watch(function() {
			return LanguageSwitch.uses();
		}, updateTermsPath);
		return updateTermsPath();
	}
]);