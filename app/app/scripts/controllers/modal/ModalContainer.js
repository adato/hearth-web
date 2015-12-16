'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ModalContainer
 * @description
 */

angular.module('hearth.controllers').controller('ModalContainer', [
	'$scope', '$rootScope', '$timeout',
	function($scope, $rootScope, $timeout) {
		console.log($scope.path);

		$scope.close = function() {
			$scope.closeThisDialog();
		};
	}
]);