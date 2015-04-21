// 'use strict';

// /**
//  * @ngdoc controller
//  * @name hearth.controllers.AddMessageCtrl
//  * @description Controller for creating new message
//  */

// angular.module('hearth.controllers').controller('AddMessageCtrl', [
// 	'$scope', 'Conversations', 'Notify', '$location',
// 	function($scope, Conversations, Notify, $location) {
// 		$scope.showError = {
// 			text: false,
// 			participant_ids: false,
// 		};
// 		$scope.message = {
// 			participant_ids: [],
// 			title: '',
// 			text: '',
// 		};

// 		$scope.hideRecipientsError = function() {
// 			$scope.showError.participant_ids = false;
// 		};
		
// 		$scope.showRecipientsError = function() {
// 			if(!$scope.message.participant_ids.length)
// 				$scope.showError.participant_ids = true;
// 		};
		
// 		$scope.isValid = function(msg) {
// 			var invalid = false;

// 			if(!msg.participant_ids.length) {
// 				invalid = $scope.showError.participant_ids = true;
// 			}

// 			if($scope.addMessageForm.text.$invalid)
// 				invalid = $scope.showError.text = true;

// 			return !invalid;
// 		};

// 		/**
// 		 * Serialize object for API create request
// 		 */
// 		$scope.serialize = function(msg) {
// 			msg.participant_ids = msg.participant_ids.map(function(item){ return item._id});
// 			return msg;
// 		};

// 		/**
// 		 * Validate message and send to API
// 		 */
// 		$scope.addMessage = function(msg) {
// 			if(!$scope.isValid(msg))
// 				return false;

// 			var data = $scope.serialize(angular.copy(msg));

//     		if($scope.sendMessage) return false;
// 			$scope.sendMessage = true;

// 			Conversations.add(data, function(res) {

//         		$scope.sendMessage = false;
// 				Notify.addSingleTranslate('NOTIFY.MESSAGE_SEND_SUCCESS', Notify.T_SUCCESS);
// 				$location.url("/messages");
//         	}, function() {
//         		$scope.sendMessage = false;
// 				Notify.addSingleTranslate('NOTIFY.MESSAGE_SEND_FAILED', Notify.T_ERROR);
// 			});
// 		};
// 	}
// ]);