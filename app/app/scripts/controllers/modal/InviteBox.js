'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.InviteBox
 * @description
 */

angular.module('hearth.controllers').controller('InviteBox', [
	'$scope', '$rootScope', 'Invitation', 'OpenGraph', 'Facebook', 'Notify', 'Validators',
	function($scope, $rootScope, Invitation, OpenGraph, Facebook, Notify, Validators) {
		$scope.showEmailForm = false;
		$scope.url = '';
		$scope.sending = false;

		var timeoutClose = false;

		$scope.fbInvite = function() {
			Facebook.inviteFriends();
			return false;
		};

		$scope.showFinished = function() {

			$(".invite-form").slideToggle();
			timeoutClose = setTimeout(function() {
				$scope.closeThisDialog();
			}, 5000);
		};

		$scope.init = function() {
			var inviteInfo = OpenGraph.getDefaultInfo();
			var title = encodeURIComponent(inviteInfo.title);
			var description = encodeURIComponent(inviteInfo.description);

			$scope.url = window.location.href.replace(window.location.hash, '');
			$scope.urlLinkedin = $scope.url + '&title=' + title + '&summary=' + description;

			$scope.endpoints = $$config.sharingEndpoints;
		};

		/**
		 * This function will test given emails and if they are wrong
		 * it will show error and return false
		 */
		$scope.testEmailsFormat = function(data) {

			var emails = $.map(data, function(value, index) {
				return value.text;
			});

			$scope.inviteForm.to_email.$error.format = false;

			if (!data) return false;

			// if emails are not array, split it by comma
			if (!angular.isArray(emails)) {
				emails = angular.copy(emails).split(",");
			}

			// validate emails 
			if (!Validators.emails(emails)) {
				$scope.showError.to_email = true;
				$scope.inviteForm.to_email.$error.format = true;
				return false;
			}

			return true;
		};

		$scope.validateInvitationForm = function(data) {
			var invalid = false;

			// is message filled?
			if ($scope.inviteForm.message.$invalid) {
				invalid = $scope.showError.message = true;
			}

			if (!data.to_email || !$scope.testEmailsFormat(data.to_email)) {
				invalid = true;
			}
			return !invalid;
		};

		$scope.transformInvitationOut = function(data) {

			if (data.to_email) {
				data.to_email = $.map(data.to_email, function(value, index) {
					return value.text;
				});
			}
			return data;
		};

		function handleEmailResult(res) {
			$rootScope.globalLoading = false;
			$scope.sending = false;
			res.ok && $scope.showFinished();
		}

		$scope.sendEmailInvitation = function(data) {
			var dataOut;

			if (!$scope.validateInvitationForm(data) || $scope.sending)
				return false;

			$scope.sending = true;
			$rootScope.globalLoading = true;
			// split emails to array and copy it to new object
			dataOut = $scope.transformInvitationOut(angular.copy(data));
			Invitation.add({
				invitation: dataOut
			}, handleEmailResult);
		};

		$scope.initForm = function() {
			angular.forEach($scope.showError, function(value, key) {
				$scope.showError[key] = false;
			});

			$("form.invite-form").show();
			$("div.invite-form").hide();

			if (timeoutClose)
				clearTimeout(timeoutClose);

			$scope.inv = {
				message: '',
				to_email: '',
			};

			$scope.showError = {
				message: false,
				to_email: false,
			};

			$scope.sent = false;
		};

		// function will show or hide email form
		$scope.toggleEmailForm = function() {
			$scope.initForm();
			$scope.showEmailForm = !$scope.showEmailForm;
		};

		$scope.close = function() {
			$scope.closeThisDialog();
		};

		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);