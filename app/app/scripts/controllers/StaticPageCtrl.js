'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.StaticPageCtrl
 * @description
 */

angular.module('hearth.controllers').controller('StaticPageCtrl', [
	'$state', '$scope', 'ngDialog',
	function($state, $scope, ngDialog) {
		$scope.loading = true;
		$scope.pageName = $state.current.name;
		$scope.finishLoading = function() {
			$scope.loading = false;
		};

		$scope.openModal = function(templateId, controller) {
			var ngDialogOptions = {
				template: templateId,
				scope: $scope,
				closeByEscape: true,
				showClose: false
			};
			if (typeof controller !== 'undefined') {
				ngDialogOptions.controller = controller;
			}

			ngDialog.open(ngDialogOptions);
		}
	}
]);