'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.Tutorial
 * @description
 */

angular.module('hearth.controllers').controller('Tutorial', [
	'$scope', '$rootScope', 'Tutorial', '$timeout',
	function($scope, $rootScope, Tutorial, $timeout) {
		$scope.slider = false;
		$scope.loaded = false;

		function processResult(res) {

			$scope.tutorials = res;
			$scope.loaded = true;
		}

		function processError(res) {
			alert("There was an error while processing this request");
		}

		$scope.loadTutorials = function() {
			Tutorial.get({user_id: $rootScope.loggedUser._id}, processResult, processError);
		};

		$scope.closeAll = function() {

			Tutorial.ignore({user_id: $rootScope.loggedUser._id}, $scope.closeThisDialog, $scope.closeThisDialog);
		};

		$scope.close = function() {

			$scope.closeThisDialog();
		};

		$scope.showMeMagic = function() {
			$scope.slider = true;
		};

		$scope.$on('initFinished', $scope.loadTutorials);
		$rootScope.initFinished && $scope.loadTutorials();
	}
]);