'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ChangePwdCtrl
 * @description 
 */

angular.module('hearth.controllers').controller('Error404Ctrl', [
	'$scope', '$location',
	function($scope, $location) {
		var container = ".main-container";
		
		$scope.goToMarket = function() {
			$location.url('/');
		};

		// hide route segment container when user comes to e404 page
		$(container).hide();

		$scope.$on('$routeChangeStart', function(next, current) { 
			// when he goes away, show container
			$(container).show();
		});
	}
]);