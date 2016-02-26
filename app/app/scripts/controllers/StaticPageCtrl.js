'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.StaticPageCtrl
 * @description
 */

angular.module('hearth.controllers').controller('StaticPageCtrl', [
	'$location', '$scope', '$timeout',
	function($location, $scope, $timeout) {
		$scope.pageName = $location.path().replace("/", "");
		$scope.loading = true;
		$scope.$on('$viewContentLoaded', function(event) {
			$timeout(function() {
				$scope.loading = false;
			}, 0);
		});
	}
]);