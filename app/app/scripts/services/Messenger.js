'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Messenger
 * @description
 */

angular.module('hearth.services').service('Messenger', [
	'$q', 'Conversations', '$rootScope', '$timeout',
	function($q, Conversations, $rootScope, $timeout) {
		$rootScope.messagesCounters = {};
		var self = this;
		var timer = null;
		this.counters = null;

		// load 
		this.loadCounters = function(done) {
			Conversations.getCounters({}, function(res) {
				self.counters = res;
				$rootScope.messagesCounters = res;
				done && done(res);
			});
		};

		this.decrUnreaded = function() {
			$rootScope.unreadedMessagesCount--;
		};
	}
]);