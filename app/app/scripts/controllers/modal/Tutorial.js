'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.Tutorial
 * @description
 */

angular.module('hearth.controllers').controller('Tutorial', [
	'$scope', '$rootScope', 'Tutorial',
	function($scope, $rootScopex, Tutorial) {
		$scope.slider = false;

		function processResult (res) {

			console.log(res);
			$scope.tutorials = res;
		}

		function processError(res) {
			alert("There was an error while processing this request");
		}

		$scope.loadTutorials = function() {
			var Service = ($rootScopex.loggedUser._id) ? Tutorial.get : Tutorial.getAll;
			Service(processResult, processError);
		};

		$scope.closeAll = function() {

			$scope.closeThisDialog();
		};

		$scope.close = function() {

			$scope.closeThisDialog();
		};

		$scope.showMeMagic = function() {
			$scope.slider = true;
		};

		$scope.loadTutorials();
	}
]);