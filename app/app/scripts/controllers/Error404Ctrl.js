'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ChangePwdCtrl
 * @description 
 */

angular.module('hearth.controllers').controller('Error404Ctrl', [
	'$scope', '$location', '$rootScope',
	function($scope, $location, $rootScope) {
		var container = ".main-container";

		$scope.basePath = $rootScope.config.basePath;
		
		$scope.goToMarket = function() {
			$location.url('/');
		};
		$scope.goToFeedback = function() {
			$location.url('feedback');
		};

		// hide route segment container when user comes to e404 page
		$(container).hide();

		$scope.$on('$routeChangeStart', function(next, current) { 
			// when he goes away, show container
			$(container).show();
		});
	}
]);