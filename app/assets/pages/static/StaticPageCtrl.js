'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.StaticPageCtrl
 * @description
 */

angular.module('hearth.controllers').controller('StaticPageCtrl', [
	'$state', '$scope', 'ngDialog', 'Auth', 'User', 'Feedback', '$rootScope', '$sce', '$log', '$location', '$timeout',
	function($state, $scope, ngDialog, Auth, User, Feedback, $rootScope, $sce, $log, $location, $timeout) {
		$scope.loading = true;
		$scope.pageName = $state.current.name;
		$scope.finishLoading = function() {
			$scope.loading = false;
		};

		const ACCEPTED_MODAL_VALUES = ['support-us-modal-pay', 'support-us-modal-write-us', 'support-us-modal-endorse'];
		const MODAL_KEY = 'open-modal';

		$scope.feedbackData = {
			text: '',
			email: ''
		};

		$scope.contactData = {
			text: '',
			email: ''
		};

		$scope.ambassadorData = {
			text: '',
			email: '',
			userId: ''
		};

		$scope.postalAddressData = {
			email: '',
			badges: false,
			numBadges: 10,
			stickers: false,
			numStickers: 20,
			fullName: '',
			street: '',
			city: '',
			psc: ''
		};

		$scope.logos = [
			'<a href="https://www.hearth.net/" target="_blank"><img src="https://www.hearth.net' + $$config.imgUrl + '/logo-dark.png" width="150" style="background:#fff; padding:10px;"></a>',
			'<a href="https://www.hearth.net/" target="_blank"><img src="https://www.hearth.net' + $$config.imgUrl + '/logo-orange.png" width="150"></a>',
			'<a href="https://www.hearth.net/" target="_blank"><img src="https://www.hearth.net' + $$config.imgUrl + '/logo.png" width="150" style="padding:10px;"></a>'
		];

		$scope.emailPattern = '^[_a-z0-9A-Z]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$';

		$scope.getLogo = function(index) {
			return $sce.trustAsHtml($scope.logos[index]);
		};

		$scope.openModal = function(templateId, controller) {
			var ngDialogOptions = {
				template: templateId,
				scope: $scope,
				closeByEscape: true,
				showClose: false
			};
			if (typeof controller !== 'undefined') {
				ngDialogOptions.controller = controller;
			}

			ngDialog.open(ngDialogOptions);
		};


		$scope.submitEmailWithPostalData = function() {
			$scope.feedbackData = {
				text: "Objednávám tímto:\n\n" +
					"Placky " + ($scope.postalAddressData.badges ? 'ANO (' + $scope.postalAddressData.numBadges + ' ks)' : 'NE') +
					", samolepky " + ($scope.postalAddressData.stickers ? 'ANO (' + $scope.postalAddressData.numStickers + ' ks)' : 'NE') + "\n\n" +
					"Jméno: " + $scope.postalAddressData.fullName + "\n" +
					"Adresa: " + $scope.postalAddressData.street +
					", " + $scope.postalAddressData.city + ", " + $scope.postalAddressData.psc + "\n\n" +
					"(Odesláno z formuláře v sekci Podpořte nás)",
				email: $scope.postalAddressData.email
			};
			sendFeedback(function() {
				$scope.addressDataEmailSent = true;
			});
		};

		$scope.submitEmailWithContactData = function() {
			$scope.feedbackData = {
				text: "Nabízím tímto pomocnou ruku:\n\n" +
					$scope.contactData.text + "\n\n" +
					"Kontakt na mne: " + $scope.contactData.email + "\n\n" +
					"(Odesláno z formuláře v sekci Podpořte nás)",
				email: $scope.contactData.email
			};
			sendFeedback(function() {
				$scope.contactDataEmailSent = true;
			});
		};

		$scope.submitEmailWithAmbassadorData = function () {
			$scope.feedbackData = {
				text: "Chci se stát ambasadorem Hearth.net:\n\n" +
					$scope.ambassadorData.text + "\n\n" +
					"Kontakt na mne: " + $scope.ambassadorData.email + "\n\n" +
					"Můj profil: https://www.hearth.net" + $rootScope.getProfileLink('User', $scope.ambassadorData.userId)  + "\n\n" +
					"(Odesláno z formuláře v sekci Podpořte nás)",
				email: $scope.ambassadorData.email
			};
			sendFeedback(function() {
				$scope.ambassadorDataEmailSent = true;
			});
		}

		var sendFeedback = function(done) {
			Feedback.add($scope.feedbackData, function() {
				done();
			}, function() {
				$log.error('Error sending feedback data');
			});
		};

		var prefillEmail = function() {
			Auth.refreshUserInfo();
			var email = $rootScope.loggedUser.email;
			var userId = $rootScope.loggedUser._id;

			// set email
			$scope.contactData.email = email;
			$scope.postalAddressData.email = email;
			$scope.ambassadorData.email = email;
			$scope.ambassadorData.userId = userId; // and userId
		};

		$scope.modalInit = function(modalId) {
			if ($location.search()[MODAL_KEY] && ACCEPTED_MODAL_VALUES.indexOf($location.search()[MODAL_KEY]) > -1 && $location.search()[MODAL_KEY] === modalId) {
				$timeout(function() {
					$scope.openModal($location.search()[MODAL_KEY]);
				}, 10);
			}
		};

		$scope.init = function() {
			if ($rootScope.loggedUser._id) prefillEmail();
		};

		$scope.init();

	}
]);