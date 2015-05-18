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
		var _loadingCounters = false;
		this.counters = null;

		// load counters and send it to callback
		this.loadCounters = function(done) {
			if(!_loadingEnabled || _loadingCounters) return false;
			_loadingCounters = true;

			Conversations.getCounters({}, function(res) {
				if(!_loadingEnabled) return false;

				_loadingCounters = false;
				self.counters = res;
				$rootScope.messagesCounters = res;
				done && done(res);
			}, function() {
				_loadingCounters = false;
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