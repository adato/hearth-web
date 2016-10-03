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

		// update counters after WS event is recieved
		$rootScope.$on('WSMessageCounter', this.updateCounters);
	}
]);