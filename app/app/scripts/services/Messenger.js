'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Messenger
 * @description
 */

angular.module('hearth.services').service('Messenger', [
	'$q', 'Conversations', '$rootScope', '$timeout',
	function($q, Conversations, $rootScope, $timeout) {
		var self = this;
		this.counters = null;
		var timer = null;

		this.loadCounters = function(done) {
			Conversations.getCounters({}, function(res) {
				self.counters = res;
				$rootScope.unreadedMessagesCount = res.unread;
				done && done(res);
			});
		};

		this.decrUnreaded = function() {
			$rootScope.unreadedMessagesCount--;
		};
	}
]);