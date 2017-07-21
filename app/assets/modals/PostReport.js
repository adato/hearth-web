'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.PostReport
 * @description
 */

angular.module('hearth.controllers').controller('PostReport', ['$scope', '$rootScope', 'Notify', 'Post', '$timeout', function($scope, $rootScope, Notify, Post, $timeout) {

	var timeout = null

	$scope.sending = false
	$scope.showErrors = false
	$scope.message = ''
	$scope.showErrors = {
		message: false,
	}

	$scope.showFinished = showFinished
	$scope.close = close
	$scope.sendReport = sendReport

	////////////////

	function showFinished() {
		$(".report-ad").slideToggle()
		timeout = $timeout($scope.closeThisDialog, 5000)
	}

	function close() {
		$timeout.cancel(timeout)
		$scope.closeThisDialog()
	}

	function sendReport() {
		var data = {
			id: $scope.post._id,
			message: $scope.message,
		}

		$.each($scope.showErrors, function(key, value) {
			$scope.showErrors[key] = true
		})

		if ($scope.sending || $scope.reportForm.message.$invalid) return false

		$rootScope.globalLoading = true
		$scope.sending = true

		Post.spam(data).$promise.then(res => {
			// unused ATM
			// $rootScope.$broadcast('reportItem', $scope.post)

			$scope.post.spam_reported = true
			$scope.sending = false
			$rootScope.globalLoading = false
			$scope.showFinished()
		}).catch(err => {
			$scope.sending = false
			$rootScope.globalLoading = false
		})
	}

}])