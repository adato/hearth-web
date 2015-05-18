'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ApiHealthChecker
 * @description
 */

angular.module('hearth.services').service('ApiHealthChecker', [
	'$rootScope',
	function($rootScope) {
		var self = this;
		var healthCheckTimeout = 2000;
		var healthCheckTimeoutPointer = 0;
		var healthCheckRunning = false;

		/**
		 * This will process health check result
		 */
		this.processHealthCheckResult = function(res) {
			// console.log("Health check result: ", res);
			if(res && res.ok && res.ok == true){
				return self.turnOff();
			}

			// if there is still an error then run again in given interval
			self.processHealthCheckFailResult(res);
		};

		/**
		 * This will schedule next health check
		 */
		this.processHealthCheckFailResult = function(res) {
			self.turnOn();
			healthCheckTimeoutPointer = setTimeout(self.sendHealthCheck, healthCheckTimeout);
		};

		/**
		 * This will send health check request and process result
		 */
		this.sendHealthCheck = function(res) {
			$.getJSON($$config.apiPath + '/health').done(self.processHealthCheckResult).fail(self.processHealthCheckFailResult);
		};

		/**
		 * Send first health check and manage locking
		 *  - eg only one health check will run at the time
		 */
		this.sendFirstHealthCheck = function() {
			if(healthCheckRunning) return false;
			healthCheckRunning = true;

			self.sendHealthCheck();
		};

		/**
		 * Turn on health check controll
		 */
		this.turnOn = function() {

			// if already started, than stop
			if(healthCheckTimeoutPointer)
				return false;

			$("#maitenancePage").fadeIn();
		};

		this.turnOff = function() {
			healthCheckRunning = false;;
			if(!$("#maitenancePage").is(":visible"))
				return false;

			$("#maitenancePage").fadeOut();
			window.location = document.URL;
			location.reload();
		};
	}
]);