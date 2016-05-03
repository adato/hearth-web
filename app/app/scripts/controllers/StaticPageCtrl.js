'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.StaticPageCtrl
 * @description
 */

angular.module('hearth.controllers').controller('StaticPageCtrl', [
	'$state', '$scope', 'ngDialog', 'Auth', 'User', 'Feedback',
	function($state, $scope, ngDialog, Auth, User, Feedback) {
		$scope.loading = true;
		$scope.pageName = $state.current.name;
		$scope.finishLoading = function() {
			$scope.loading = false;
		};

		$scope.feedbackData = {
			text: '',
			email: ''
		}

		$scope.contactData = {
			text: '',
			email: ''
		}

		$scope.postalAddressData = {
			what: 'Tohle je test / neodpovidat',
			email: '',
			badges: true,
			numBadges: 2,
			stickers: false,
			numStickers: 2,
			fullName: '',
			street: '',
			city: '',
			psc: ''
		}

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
		}


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
			}
			sendFeedback(function() {
				$scope.addressDataEmailSent = true;
			});
		}

		$scope.submitEmailWithContactData = function() {
			$scope.feedbackData = {
				text: "Nabízím tímto pomocnou ruku:\n\n" +
					$scope.contactData.text + "\n\n" +
					"Kontakt na mne: " + $scope.contactData.email + "\n\n" +
					"(Odesláno z formuláře v sekci Podpořte nás)",
				email: $scope.contactData.email
			}
			sendFeedback(function() {
				$scope.contactDataEmailSent = true;
			});
		}

		var sendFeedback = function(done) {
			Feedback.add($scope.feedbackData, function() {
				done();
			}, function() {
				console.log('err sending feedback data');
			})
		}

		var prefillEmail = function() {
			Auth.init(function() {
				User.get({
					_id: $scope.loggedUser._id
				}, function(data) {
					$scope.contactData.email = data.email;
					$scope.postalAddressData.email = data.email;
					$scope.postalAddressData.fullName = data.name;
				});
			});
		}

		$scope.init = function() {
			if ($scope.loggedUser._id) {
				prefillEmail();
			}
		}

		$scope.init();

	}
]);