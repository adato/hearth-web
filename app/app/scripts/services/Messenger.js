'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Messenger
 * @description
 */

angular.module('hearth.services').service('Messenger', [
	'$q', 'Conversations', '$rootScope', '$timeout',
	function($q, Conversations, $rootScope, $timeout) {
		const _LOAD_COUNTERS_INTERVAL = 10000;
		var self = this;

		this.loadUnreadedMessagesCount = function() {
			Conversations.getCounters({}, function(res) {
				$rootScope.unreadedMessagesCount = res.unread;
				$timeout(self.loadUnreadedMessagesCount,_LOAD_COUNTERS_INTERVAL);
			});
		};

		this.loadUnreadedMessagesCount();
	}
]);