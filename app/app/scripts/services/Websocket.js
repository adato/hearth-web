'use strict';

/**
 * @ngdoc service
 * @name hearth.services.websocket
 * @description Websocket service
 */

angular.module('hearth.services').factory('Websocket', ['$rootScope', 'Session', '$cable', '$window',
	function($rootScope, Session, $cable, $window) {

		var factory = {};

		// console.log($$config);

		var cable = $cable($window.$$config.websocket);

		factory.subscribe = function(channel, cb) {
			Session.show(function(res) {
				console.log(res);
				cable.subscribe({
					channel: channel,
					user_id: res._id
				}, {
					received: cb
				});
			});
		};

		// TeMP
		// factory.cable = cable;

		return factory;

	}
]);