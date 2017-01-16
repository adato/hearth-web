'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemEdit
 * @description
 */

angular.module('hearth.controllers').controller('EmailSharing', [
	'$scope', '$rootScope', 'Notify', 'Post', 'Validators', '$timeout',
	function($scope, $rootScope, Notify, Post, Validators, $timeout) {
		var timeout = null;
		$scope.sending = false;
		$scope.sharing = {
			emails: '',
			message: '',
			id: $scope.post._id
		};
		$scope.showErrors = {
			emails: false,
			message: false,
		}

		$scope.showFinished = function() {
			$(".email-sharing").slideToggle();
			timeout = $timeout(function() {
				$scope.closeThisDialog();
			}, 5000);
		};

		$scope.close = function() {
			$timeout.cancel(timeout);
			$scope.closeThisDialog();
		};

		$scope.validate = function(data) {
			var invalid = false;

			$scope.emailForm.$setDirty();

			if (data.emails.length == 0) {
				invalid = $scope.showErrors.emails = true;

			} else if (!Validators.emails(data.emails)) {

				invalid = $scope.showErrors.emails = true;
				$scope.emailForm.emails.$error.format = true;
			}

			if ($scope.emailForm.message.$invalid)
				invalid = $scope.showErrors.message = true;

			return !invalid;
		};

		$scope.testEmailsFormat = function(emails) {
			$scope.emailForm.emails.$error.format = false;

			if (emails !== '' && !Validators.emails(emails.split(","))) {
				$scope.emailForm.emails.$error.format = true;
				return false;
			}
			return true;
		};

		$scope.resetForm = function() {
			$scope.emailForm.emails.$error.format = false;
		};

		$scope.send = function() {
			$scope.resetForm();

			var data = angular.copy($scope.sharing);
			data.emails = data.emails.split(",").map(function(item) {
				return item.trim();
			});

			if (!$scope.validate(data))
				return false;

			$rootScope.globalLoading = true;
			if ($scope.sending) return false;
			$scope.sending = true;

			Post.emailShare(data, function(res) {

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