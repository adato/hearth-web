'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.AddMessageCtrl
 * @description Controller for creating new message
 */

angular.module('hearth.controllers').controller('AddMessageCtrl', [
	'$scope', 'Messages', 'Notify', '$location',
	function($scope, Messages, Notify, $location) {
		$scope.showError = {
			text: false,
			recipients: false,
		};
		$scope.message = {
			recipients: [],
			subject: '',
			text: '',
		};

		$scope.hideRecipientsError = function() {
			$scope.showError.recipients = false;
		};
		
		$scope.showRecipientsError = function() {
			if(!$scope.message.recipients.length)
				$scope.showError.recipients = true;
		};
		
		$scope.isValid = function(msg) {
			var invalid = false;

			if(!msg.recipients.length) {
				invalid = $scope.showError.recipients = true;
			}

			if($scope.addMessageForm.text.$invalid)
				invalid = $scope.showError.text = true;

			return !invalid;
		};

		$scope.addMessage = function(msg) {
			if(!$scope.isValid(msg))
				return false;

    		if($scope.sendMessage) return false;
			$scope.sendMessage = true;

			Messages.add(msg, function(res) {

        		$scope.sendMessage = false;
				Notify.addSingleTranslate('NOTIFY.MESSAGE_SEND_SUCCESS', Notify.T_SUCCESS);
				$location.url("/messages");
        	}, function() {
        		$scope.sendMessage = false;
				Notify.addSingleTranslate('NOTIFY.MESSAGE_SEND_FAILED', Notify.T_ERROR);
			});
		};
	}
]);