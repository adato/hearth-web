'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.Tutorial
 * @description
 */

angular.module('hearth.controllers').controller('Tutorial', [
	'$scope', '$rootScope', 'Tutorial',
	function($scope, $rootScope, Tutorial) {
		$scope.slider = false;
		function processResult(res) {

			console.log(res);
			$scope.tutorials = res;
		}

		function processError(res) {
			alert("There was an error while processing this request");
		}

		$scope.loadTutorials = function() {
			var Service = ($rootScope.loggedUser._id) ? Tutorial.get : Tutorial.getAll;
			// Service(processResult, processError);
			var res = [{
				"text": "This is tutorial page no.1",
				"icon": "fa-globe",
				"image": "http://guardianlv.com/wp-content/uploads/2013/05/Justdoit-650x406.jpg",
				"created_at": "2014-10-01T11:21:33.993+02:00"
			}];

			processResult(res);
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

		$scope.$on('initFinished', $scope.loadTutorials);
		$rootScope.initFinished && $scope.loadTutorials();
	}
]);