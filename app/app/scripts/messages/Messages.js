'use strict';

/**
 * @ngdoc controller
 * @name hearth.messages.Messages
 * @description
 */

angular.module('hearth.messages').controller('Messages', [
	'$scope',
	function($scope) {

		$scope.messages = [{
			id: 1,
			text: 'text',
			subject: 'subject',
			type: 'need'
		}, {
			id: 2,
			text: 'text2',
			subject: 'subject2',
			type: 'offer'
		}, {
			id: 3,
			text: 'text3',
			subject: 'subject3',
			read: true,
			type: 'message'
		}, {
			id: 4,
			text: 'text4',
			subject: 'subject4',
			read: true,
			type: 'message'
		}, {
			id: 2,
			text: 'text2',
			subject: 'subject2',
			read: true,
			type: 'message'
		}];

		$scope.unreadCount = $.map($scope.messages, function(item) {
			return item.read ? undefined : item;
		}).length;

		$scope.newMessage = function() {
			$scope.editedMessage = {
				text: '',
				subject: '',
				type: 'message'
			};
		};
		$scope.cancelMessage = function() {
			$scope.editedMessage = undefined;
		};
		$scope.checkAllValue = false;
		$scope.checkAll = function() {
			angular.forEach($scope.messages, function(message, key) {
				$scope.messages[key].checked = $scope.checkAllValue;
			});
		};
	}
]);