'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.FeedbackCtrl
 * @description 
 */

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
			if ($location.search().fromDelete) {
				$scope.fromAccountDelete = true;
			}
			Auth.init(function() {
				User.get({
					user_id: $scope.loggedUser._id
				}, function(data) {
					$scope.feedback.email = data.email;
				});
			});
		};

		$scope.submit = function() {
			if (!$scope.feedbackForm.$valid) {
				return;
			}
			$scope.sending = true;
			return Feedback.add($scope.feedback, function() {
				$scope.feedbackForm.$setPristine();
				$scope.sent = true;
				return $scope.sent;
			}, function() {
				$scope.feedbackForm.$setPristine();
				return $scope.init();
			});
		};
		$scope.init();
	}
]);