'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ConfirmBox
 * @description
 */

angular.module('hearth.controllers').controller('ConfirmBox', [
	'$scope', '$rootScope',
	function($scope, $rootScope) {

		$scope.confirm = function() {
			
			console.log($scope.callback);
			console.log($scope.params);
			// $scope.callback.apply($scope.requestedScope, $scope.params);
		};
	}
]);