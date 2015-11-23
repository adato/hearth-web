'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MapCtrl
 * @description Map controller, handler events from underlaying component
 */

angular.module('hearth.controllers').controller('MapCtrl', [
	'$scope',
	function($scope) {
		$scope.mapSelected = true;

	}
]);
