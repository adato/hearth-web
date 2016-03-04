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
			if (!data) {
				return false;
			}

			var emails = $.map(data, function(value, index) {
				return value.text;
			});

			$scope.inviteForm.to_email.$error.format = false;

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

		function validateInvitationForm(data) {
			var invalid = false;
			if (!data.to_email) invalid = $scope.showError.to_email = true;
			if (!data.message) invalid = $scope.showError.message = true;
			return !invalid;
		};

		function transformInvitationOut(data) {
			if (data.to_email) {
				data.to_email = $.map(data.to_email, function(value, index) {
					return value.text;
				});
			}
			return data;
		};

		$scope.invitationsStatus = [];
		$scope.validateEmailAddress = function(tag) {
			//console.log(tag);
			Invitation.check({
				email: tag.text
			}, function(res) {
				console.log(tag.text, res);
				if (res.invited || res.existing) {
					//vypsat to nekde
					// var intel = {email: tag.text};
					// intel[(res.existing ? 'existing' : 'invited')] = true;
					// $scope.invitationsStatus.push(intel);
				}
			});
		};
		$scope.removeFromInvitationsStatus = function(tag){
			
		};

		function handleEmailResult(res) {
			console.log(res);
			$rootScope.globalLoading = false;
			$scope.sending = false;
			res.ok && $scope.showFinished();
		}

		$scope.sendEmailInvitation = function(data) {
			var dataOut;

			if (!validateInvitationForm(data) || $scope.sending) return false;

			$scope.sending = true;
			$rootScope.globalLoading = true;
			// split emails to array and copy it to new object
			dataOut = transformInvitationOut(angular.copy(data));
			Invitation.add({
				invitation: dataOut
			}, handleEmailResult);
		};

		function initForm() {
			angular.forEach($scope.showError, function(value, key) {
				$scope.showError[key] = false;
			});

			$("form.invite-form").show();
			$("div.invite-form").hide();

			if (timeoutClose)
				clearTimeout(timeoutClose);

			$scope.inv = {
				message: '',
				to_email: ''
			};

			$scope.showError = {
				message: false,
				to_email: false
			};

			$scope.sent = false;
		};

		// function will show or hide email form
		$scope.toggleEmailForm = function() {
			initForm();
			$scope.showEmailForm = !$scope.showEmailForm;
		};

		$scope.close = function() {
			$scope.closeThisDialog();
		};

		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);