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

		$scope.showFinished = function(res) {
			processInvitationResponse(res, function(arr, errsOrWarns) {
				$scope.invitationsStatus = arr;
				$(".invite-form").slideToggle();
				if (!errsOrWarns) {
					timeoutClose = setTimeout(function() {
						$scope.closeThisDialog();
					}, 5000);
				}
			});
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

		var STATUS_INVITE_SUCCESS = 'invite_success';
		var STATUS_ALREADY_INVITED = 'invited'; //API delivers this, only change if API changes
		var STATUS_ALREADY_EXISTING = 'existing'; //API delivers this, only change if API changes
		//var STATUS_NOT_SENT = 'not_sent'; //assigned if API did not succeed to send email to that email | currently not used

		var itemStatusTextVocabulary = {};
		itemStatusTextVocabulary[STATUS_INVITE_SUCCESS] = 'INVITATION_STATUS.INVITATION_SENT';
		itemStatusTextVocabulary[STATUS_ALREADY_INVITED] = 'INVITATION_STATUS.USER_ALREADY_INVITED';
		itemStatusTextVocabulary[STATUS_ALREADY_EXISTING] = 'INVITATION_STATUS.USER_ALREADY_EXIST';
		//itemStatusTextVocabulary[STATUS_NOT_SENT] = 'INVITATION_STATUS.INVITATION_NOT_SENT'; // currently not used

		var itemStatusTemperVocabulary = {};
		itemStatusTemperVocabulary[STATUS_INVITE_SUCCESS] = 'success';
		itemStatusTemperVocabulary[STATUS_ALREADY_INVITED] = 'warning';
		itemStatusTemperVocabulary[STATUS_ALREADY_EXISTING] = 'error';
		// itemStatusTemperVocabulary[STATUS_NOT_SENT] = 'error'; // currently not used

		$scope.itemStatusIconVocabulary = {}
		$scope.itemStatusIconVocabulary[itemStatusTemperVocabulary[STATUS_INVITE_SUCCESS]] = 'fa fa-fw fa-check text-success';
		$scope.itemStatusIconVocabulary[itemStatusTemperVocabulary[STATUS_ALREADY_INVITED]] = 'fa fa-fw fa-exclamation-triangle text-warning';
		$scope.itemStatusIconVocabulary[itemStatusTemperVocabulary[STATUS_ALREADY_EXISTING]] = 'fa fa-fw fa-exclamation-circle text-danger';
		// $scope.itemStatusIconVocabulary[itemStatusTemperVocabulary[STATUS_NOT_SENT]] = 'fa fa-fw fa-exclamation-circle text-danger'; // currently not used

		$scope.invitationsStatus = [];

		//expects an object with property text (containing an email address) to be bound to 'this'.
		function processInvitationCheckResponse(res) {
			// on reject(422), whole response object is returned, but we are only interested in data
			if (res.config && res.status) res = res.data;
			// only notify on already invited or already existing emails
			if (res.invited || res.existing) {
				var status = (res.existing ? STATUS_ALREADY_EXISTING : STATUS_ALREADY_INVITED);
				var intel = {
					status: itemStatusTemperVocabulary[status],
					text: itemStatusTextVocabulary[status],
					email: this.text
				};
				$scope.invitationsStatus.push(intel);
			}
		}
		var invitationStatusTemp = [];

		function processInvitationResponse(responseObj, cb) {
			var arr = [],
				assigned = false,
				errsOrWarns = false;
			//looping this way is more complex, but keeps the order of emails intact
			for (var i = 0, l = invitationStatusTemp.length; i < l; i++) {
				assigned = false;
				var item = {
						status: null,
						text: null,
						email: invitationStatusTemp[i].email
					}
					// for (var j = responseObj.invited_emails.length; j--;) {
					// 	if (invitationStatusTemp[i].email === responseObj.invited_emails[j]) {
					// 		item.status = itemStatusTemperVocabulary[STATUS_INVITE_SUCCESS];
					// 		item.text = itemStatusTextVocabulary[STATUS_INVITE_SUCCESS];
					// 		assigned = true;
					// 		break;
					// 	}
					// }
					// if (!assigned) {
				for (var j = responseObj.existing_emails.length; j--;) {
					if (invitationStatusTemp[i].email === responseObj.existing_emails[j]) {
						item.status = itemStatusTemperVocabulary[STATUS_ALREADY_INVITED];
						item.text = itemStatusTextVocabulary[STATUS_ALREADY_EXISTING];
						assigned = true;
						errsOrWarns = true;
						break;
					}
				}
				// }
				if (!assigned) {
					item.status = itemStatusTemperVocabulary[STATUS_INVITE_SUCCESS];
					item.text = itemStatusTextVocabulary[STATUS_INVITE_SUCCESS];
					errsOrWarns = true;
				}
				arr.push(item);
			}
			if (cb && typeof cb === 'function') cb(arr, errsOrWarns);
			return arr;
		}
		$scope.validateEmailAddress = function(tag) {
			Invitation.check({
				email: tag.text
			}, processInvitationCheckResponse.bind(tag), processInvitationCheckResponse.bind(tag));
		};
		$scope.removeFromInvitationsStatus = function(tag, array) {
			for (var i = array.length; i--;) {
				if (array[i].email === tag.text) {
					array.splice(i, 1);
					break;
				}
			}
		};

		function handleEmailResult(res) {
			$rootScope.globalLoading = false;
			$scope.sending = false;
			res.ok && $scope.showFinished(res);
		}

		$scope.sendEmailInvitation = function(data) {
			var dataOut;

			if (!validateInvitationForm(data) || $scope.sending) return false;

			//clear invitation summary items but keep them for when reponse
			//arrives and difference analysis can be done
			invitationStatusTemp = (function(data) {
				var arr = [];
				for (var i = 0, l = data.to_email.length; i < l; i++) {
					arr.push({
						email: data.to_email[i].text
					})
				}
				return arr;
			})(data);
			$scope.invitationsStatus = [];

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