'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Messenger
 * @description
 */

angular.module('hearth.services').service('Messenger', [
	'$rootScope',
	function($rootScope) {
		$rootScope.messagesCounters = {};

		this.updateCounters = function(event, args) {
			$rootScope.messagesCounters = args;
		};

		this.disableLoading = function() {
			_loadingEnabled = false;
		};

		this.enableLoading = function() {
			_loadingEnabled = true;
		};

		this.setUnreadCount = function(count) {
			$rootScope.messagesCounters.unread = count;
		}

		this.decreaseUnread = function() {
			$rootScope.messagesCounters.unread--;
		};

		this.increaseUnread = function() {
			$rootScope.messagesCounters.unread++;
		};
	}
]);