'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.TermsCtrl
 * @description
 */

angular.module('hearth.controllers').controller('TermsCtrl', [
	'$scope', 'LanguageSwitch', '$rootScope', '$stateParams',
	function($scope, LanguageSwitch, $rootScope, $stateParams) {
		$scope.termsPath = false;
		var termFile = '/terms.html';

		$scope.init = function() {
			$scope.termsPath = '/app/locales/' + $rootScope.language + termFile;
		};

		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);