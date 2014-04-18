'use strict';

angular.module('hearth.controllers').controller('FeedbackCtrl', [
	'$scope', 'Auth', 'User', '$timeout', '$location', 'Feedback', 'ResponseErrors',
	function($scope, Auth, User, $timeout, $location, Feedback, ResponseErrors) {
		$scope.init = function() {
			$scope.sent = false;
			$scope.sending = false;
			$scope.feedback = {
				text: '',
				email: ''
			};
			$scope.errors = new ResponseErrors();
			if (($location.search().fromDelete != null) && $location.search().fromDelete) {
				$scope.fromAccountDelete = true;
			}
			if (!$scope.loggedUser.loggedIn) {
				return;
			}
			return User.get({
				userId: $scope.loggedUser._id
			}, function(data) {
				$scope.feedback.email = data.email;
				return $scope.feedback.name = data.name;
			});
		};
		$scope.submit = function() {
			if (!$scope.feedbackForm.$valid) {
				return;
			}
			$scope.sending = true;
			return Feedback.add($scope.feedback, function(data) {
				$scope.feedbackForm.$setPristine();
				return $scope.sent = true;
			}, function() {
				$scope.feedbackForm.$setPristine();
				return $scope.init();
			});
		};
		return $scope.init();
	}
]);