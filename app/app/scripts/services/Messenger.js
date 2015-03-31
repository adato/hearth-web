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
		this.counters = null;
		var timer = null;

		this.loadCounters = function(done) {
			Conversations.getCounters({}, function(res) {
				self.counters = res;
				$rootScope.unreadedMessagesCount = self.counters.unread;
				done && done(res);

				$timeout.cancel(timer);
				timer = $timeout(self.loadCounters,_LOAD_COUNTERS_INTERVAL);
			});
		};

		function init() {
			if($rootScope.loggedUser._id)
				self.loadCounters();
		};
		
		$rootScope.$on('initFinished', init);
		$rootScope.initFinished && init();
	}
]);