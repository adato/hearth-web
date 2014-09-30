'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.Tutorial
 * @description
 */

angular.module('hearth.controllers').controller('Tutorial', [
	'$scope', '$rootScope',
	function($scope, $rootScopex) {
		$scope.slider = false;
		
		$scope.init = function() {

		};

		$scope.closeAll = function() {

			$scope.closeThisDialog();
		};

		$scope.close = function() {

			$scope.closeThisDialog();
		};

		$scope.init();
	}
]);