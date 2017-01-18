'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemEdit
 * @description
 */

angular.module('hearth.controllers').controller('ItemReport', [
	'$scope', '$rootScope', 'Notify', 'Post', '$timeout',
	function($scope, $rootScope, Notify, Post, $timeout) {
		var timeout = null;
		$scope.sending = false;
		$scope.showErrors = false;
		$scope.message = '';
		$scope.showErrors = {
			message: false,
		}

		$scope.showFinished = function() {

			$(".report-ad").slideToggle();
			timeout = $timeout(function() {
				$scope.closeThisDialog();
			}, 5000);
		};

		$scope.close = function() {
			$timeout.cancel(timeout);
			$scope.closeThisDialog();
		};

		$scope.sendReport = function() {
			var data = {
				id: $scope.post._id,
				message: $scope.message,
			};

			$.each($scope.showErrors, function(key, value) {
				$scope.showErrors[key] = true;
			});

			if ($scope.sending || $scope.reportForm.message.$invalid) {
				return false;
			}

			$rootScope.globalLoading = true;
			$scope.sending = true;

			Post.spam(data, function(res) {
				$rootScope.$broadcast('reportItem', $scope.post);

				$scope.post.spam_reported = true;
				$scope.sending = false;
				$rootScope.globalLoading = false;
				$scope.showFinished();
				// Notify.addSingleTranslate('NOTIFY.POST_SPAM_REPORT_SUCCESS', Notify.T_SUCCESS);
			}, function(err) {

				$scope.sending = false;
				$rootScope.globalLoading = false;
			});
		};
	}
]);