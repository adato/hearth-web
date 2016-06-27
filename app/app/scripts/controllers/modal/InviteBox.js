'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.InviteBox
 * @description
 */

angular.module('hearth.controllers').controller('InviteBox', [
	'$scope', '$rootScope', 'Invitation', 'OpenGraph', 'Facebook', 'Notify', 'Validators', '$window',
	function($scope, $rootScope, Invitation, OpenGraph, Facebook, Notify, Validators, $window) {
		$scope.showEmailForm = false;
		$scope.url = '';
		$scope.plaintTitle = '';
		$scope.urlTitle = '';
		$scope.sending = false;

		var token;
		var timeoutClose = false;
		var inviteInfo, title, plainTitle, description;

		$scope.fbInvite = function() {
			// Facebook.inviteFriends(token);
			FB.ui({
				method: 'share',
				href: $scope.url + $scope.plaintTitle,
				quote: description
			})
		};

		$scope.showFinished = function() {
			$(".invite-form").slideToggle();
			timeoutClose = setTimeout(function() {
				$scope.closeThisDialog();
			}, 5000);
		};

		$scope.init = function() {
			inviteInfo = OpenGraph.getDefaultInfo();
			title = encodeURIComponent(inviteInfo.title);
			description = encodeURIComponent(inviteInfo.description);

			// link to the landing page
			$scope.url = $window.location.origin;
			$scope.urlLinkedin = $scope.url + '?title=' + title + '&summary=' + description;
			$scope.endpoints = $$config.sharingEndpoints;
			Invitation.getReferralCode(function(res) {
				token = res.token;
				if ($rootScope.debug) console.log('token: ', token);
				$scope.url += '?' + $$config.referrerCookieName + '=' + token;
				$scope.urlTitle = '&title=' + title;
				$scope.plaintTitle = '&title=' + inviteInfo.title;
				$scope.urlLinkedin = $scope.url + $scope.urlTitle + '&summary=' + description;;
			});
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

		$scope.validateInvitationForm = function(data) {
			var invalid = false;

			if (!data.to_email) {
				invalid = $scope.showError.to_email = true;
			}

			// is message filled?
			if (!data.message) {
				invalid = $scope.showError.message = true;
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

			if (!$scope.validateInvitationForm(data) || $scope.sending) {
				return false;
			}

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