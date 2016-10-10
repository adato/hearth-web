'use strict';

/**
 * @ngdoc service
 * @name hearth.services.websocket
 * @description Websocket service
 */

angular.module('hearth.services').factory('Websocket', ['$rootScope', 'Session', '$cable', '$window', '$q',
	function($rootScope, Session, $cable, $window, $q) {

		var factory = {};

		var cable,
			inited;

		$rootScope.$on('onUserLogin', function(event, data) {
			init();
		});

		factory.subscribe = function(channel) {
			return $q(function(resolve, reject) {
				if (inited) {
					cable.subscribe({
						channel: channel,
						user_id: $rootScope.user._id
					}, {
						received: resolve
					});
				} else {
					reject({
						error: 'Cannot subscribe not logged users.'
					});
				}
			});
		};

		return factory;

		///////////////

		function init() {
			if (inited) return;
			cable = $cable($window.$$config.websocket);
			inited = true;
		}

	}
]);