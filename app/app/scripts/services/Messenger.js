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
		var _loadingEnabled = true;
		this.counters = null;

		// load counters and send it to callback
		this.loadCounters = function(done) {
			if(!_loadingEnabled) return false;

			Conversations.getCounters({}, function(res) {
				if(!_loadingEnabled) return false;

				self.counters = res;
				$rootScope.messagesCounters = res;
				done && done(res);
			});
		};

		this.disableLoading = function() {
			_loadingEnabled = false;
		};

		this.enableLoading = function() {
			_loadingEnabled = true;
		};

		this.decrUnreaded = function() {
			$rootScope.messagesCounters.unread--;
		};
	}
]);