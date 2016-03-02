'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.LinkSharing
 * @description
 */

angular.module('hearth.controllers').controller('LinkSharing', [
	'$scope', '$rootScope', '$timeout',
	function($scope, $rootScope, $timeout) {
		var timeout = null;

		$scope.close = function() {
			$timeout.cancel(timeout);
			$scope.closeThisDialog();
		};
	}
]);