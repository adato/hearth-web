'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.StaticPageCtrl
 * @description
 */

angular.module('hearth.controllers').controller('StaticPageCtrl', [
	'$state', '$scope',
	function($state, $scope) {
		$scope.loading = true;
		$scope.pageName = $state.current.name;
		$scope.finishLoading = function() {
			$scope.loading = false;
		};
	}
]);