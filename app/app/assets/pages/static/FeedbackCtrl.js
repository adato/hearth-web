'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.FeedbackCtrl
 * @description
 */

angular.module('hearth.controllers').controller('FeedbackCtrl', [
	'$scope', 'Auth', 'User', '$timeout', '$location', 'Feedback', 'ResponseErrors', 'MultipartForm', '$sce',
	function($scope, Auth, User, $timeout, $location, Feedback, ResponseErrors, MultipartForm, $sce) {
		$scope.init = function() {
			var loggedUser = Auth.getCredentials();
			var email = loggedUser.email;

			$scope.formUrl = $sce.trustAsResourceUrl($$config.apiPath + '/feedback');
			$scope.sent = false;
			$scope.sending = false;
			$scope.feedback = {
				text: '',
				email: email ? email : ''
			};
			$scope.file = null;
			$scope.showError = {
				email: false,
				text: false
			};

			$scope.clearFileInput();

			$scope.errors = new ResponseErrors();

			if ($location.search().fromDelete) {
				$scope.fromAccountDelete = true;
			}
		};

		$scope.clearFileInput = function() {
			angular.element("input[type='file']").val(null);
		};

		$scope.uploadedFile = function(element) {
			$scope.$apply(function($scope) {
				$scope.file = element.files[0];
			});
		};

		$scope.submit = function() {
			var uploadUrl = $$config.apiPath + '/feedback';
			$scope.sending = true;

			MultipartForm.post(uploadUrl, $scope.feedback, $scope.file).success(function() {
				$scope.sent = true;
				$scope.sending = false;
			}).error(function() {
				$scope.sending = false;
				return $scope.init();
			});
		};

		$scope.init();
	}
]);