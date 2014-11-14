'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.TermsCtrl
 * @description
 */

angular.module('hearth.controllers').controller('TermsCtrl', [
	'$scope', 'LanguageSwitch', '$rootScope',
	function($scope, LanguageSwitch, $rootScope) {
		$scope.termsPath = false;

		$scope.init = function() {
			$scope.termsPath = '/app/locales/' + $rootScope.language + '/terms.html';
		};

		$scope.$on('initFinished', $scope.init);
        $rootScope.initFinished && $scope.init();
	}
]);