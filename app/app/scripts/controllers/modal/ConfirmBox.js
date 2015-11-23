'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ConfirmBox
 * @description
 */

angular.module('hearth.controllers').controller('ConfirmBox', [
	'$scope', '$rootScope',
	function($scope, $rootScope) {
		/**
		 * Controller expects to have some parametres in the scope:
		 * title - translation code for title of confirm box
		 * text - translation code for text of confirm box
		 * callback - callback function
		 * params - array of params to pass into callback
		 * callbackScope - if callback has its own scope
		 */

		// called when clicked on confirm button
		$scope.confirm = function() {
			var scope = $scope.callbackScope || this;
			$scope.closeThisDialog();

			if ($scope.params)
				$scope.callback.apply(scope, $scope.params);
			else
				$scope.callback.apply(scope);

		};
	}
]);
