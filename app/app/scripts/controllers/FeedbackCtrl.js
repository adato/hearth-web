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

			$scope.showError = {
				email: false,
				text: false,
			};

			$scope.errors = new ResponseErrors();
			if ($location.search().fromDelete) {
				$scope.fromAccountDelete = true;
			}
			Auth.init(function() {
				User.get({
					_id: $scope.loggedUser._id
				}, function(data) {
					$scope.feedback.email = data.email;
				});
			});
		};

		$scope.submit = function() {
			if (!$scope.feedbackForm.$valid || $scope.sending) return;
			$scope.sending = true;

			return Feedback.add($scope.feedback, function() {
				$scope.sent = true;
				$scope.sending = false;

				return $scope.sent;
			}, function() {
				$scope.sending = false;
				return $scope.init();
			});
		};
		$scope.init();
	}
]);