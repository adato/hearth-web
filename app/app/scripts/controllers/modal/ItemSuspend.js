'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemEdit
 * @description
 */

angular.module('hearth.controllers').controller('ItemSuspend', [
	'$scope', '$rootScope', 'Notify', 'Post', '$timeout',
	function($scope, $rootScope, Notify, Post, $timeout) {
		var timeout = null;
		$scope.sending = false;
		$scope.showErrors = false;
		$scope.data = {
			suspendMessage: ''
		};
		$scope.showErrors = {
			message: false,
		}

		$scope.showFinished = function() {
			$(".modal").slideToggle();
			timeout = $timeout(function() {
				$scope.closeThisDialog();
			}, 5000);
		};

		$scope.close = function() {
			$timeout.cancel(timeout);
			$scope.closeThisDialog();
		};

		$scope.suspend = function(data) {
			$rootScope.pauseToggle($scope.item, {
				message: data.suspendMessage
			}, function(res) {
				$scope.closeThisDialog();
			});
		}
	}
]);