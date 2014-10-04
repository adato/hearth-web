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

		$scope.next = function() {

		    $('.flexslider').flexslider('next');
		};

		$scope.prev = function() {

		    $('.flexslider').flexslider('prev');
		};

		$scope.loadTutorials = function() {
			// Tutorial.get({user_id: $rootScope.loggedUser._id}, processResult, processError);
			var res = [{
				"text": "Test tutorialu. Tady bude nejaky pekny popisny text. ",
				"icon": "fa-check",
				"image": "https://hearth-net-topmonks-dev-ugc.s3.amazonaws.com/uploads/tutorial_images/542c009e6639640002000000/tutorial_image.jpg",
				"created_at": "2014-10-01T15:24:46.429+02:00"
			},
			{
				"text": "Test tutorialu2. Tady bude nejaky pekny popisny text. ",
				"icon": "fa-check",
				"image": "https://hearth-net-topmonks-dev-ugc.s3.amazonaws.com/uploads/tutorial_images/542c009e6639640002000000/tutorial_image.jpg",
				"created_at": "2014-10-01T15:24:46.429+02:00"
			},
			{
				"text": "Test tutorialu3. Tady bude nejaky pekny popisny text. ",
				"icon": "fa-phone",
				"image": "https://hearth-net-topmonks-dev-ugc.s3.amazonaws.com/uploads/tutorial_images/542c009e6639640002000000/tutorial_image.jpg",
				"created_at": "2014-10-01T15:24:46.429+02:00"
			},
			{
				"text": "Test tutorialu4. Tady bude nejaky pekny popisny text. ",
				"icon": "fa-check",
				"image": "https://hearth-net-topmonks-dev-ugc.s3.amazonaws.com/uploads/tutorial_images/542c009e6639640002000000/tutorial_image.jpg",
				"created_at": "2014-10-01T15:24:46.429+02:00"
			},
			{
				"text": "Test tutorialu5. Tady bude nejaky pekny popisny text. ",
				"icon": "fa-check",
				"image": "https://hearth-net-topmonks-dev-ugc.s3.amazonaws.com/uploads/tutorial_images/542c009e6639640002000000/tutorial_image.jpg",
				"created_at": "2014-10-01T15:24:46.429+02:00"
			}
			];

			processResult(res);
		};

		$scope.closeAll = function() {

			Tutorial.ignore({
				user_id: $rootScope.loggedUser._id
			}, $scope.closeThisDialog, $scope.closeThisDialog);
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