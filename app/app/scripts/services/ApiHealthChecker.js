'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ApiHealthChecker
 * @description
 */

angular.module('hearth.services').service('ApiHealthChecker', [
	'$rootScope', 'appConfig',
	function($rootScope, appConfig) {
		var self = this;
		var healthCheckTimeout = 2000;
		var healthCheckTimeoutPointer = 0;

		/**
		 * This will process health check result
		 */
		this.processHealthCheckResult = function(res) {
			console.log("Health check result: ", res);
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
			console.log("Health check failed :-(");
			healthCheckTimeoutPointer = setTimeout(self.sendHealthCheck, healthCheckTimeout);
		};

		/**
		 * This will send health check request and process result
		 */
		this.sendHealthCheck = function(res) {
			console.log("Testing health");
			$.getJSON(appConfig.apiPath + '/health').done(self.processHealthCheckResult).fail(self.processHealthCheckFailResult);
		};

		/**
		 * Turn on health check controll
		 */
		this.turnOn = function() {

			// if already started, than stop
			if(healthCheckTimeoutPointer)
				return false;

			$("#maitenancePage").fadeIn();
			self.sendHealthCheck();
		};

		this.turnOff = function() {

			$("#maitenancePage").fadeOut();
			window.location = document.URL;
			location.reload();
		};
	}
]);