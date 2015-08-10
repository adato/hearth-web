'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ApiHealthChecker
 * @description
 */

angular.module('hearth.services').service('ApiHealthChecker', [
	'$rootScope', '$timeout', '$interval',
	function($rootScope, $timeout, $interval) {
		var self = this;
		var healthCheckTimeout = 2000;
		var healthCheckTimeoutPointer = 0;
		var healthCheckRunning = false;
		var version = null;
		var checkVersionInterval = null;
		$rootScope.showNewVersionNotify = false;
		var _check_interval = 60000;

		/**
		 * Close notification about new version
		 */
		this.closeNotify = function() {
			$rootScope.showNewVersionNotify = false;
		};

		/**
		 * Checkout actual app version
		 */
		this.getAppVersion = function(done) {
			$.get('/version.txt').success(done);
		};

		/**
		 * Check version and optionally show notification
		 */
		this.checkVersion = function() {
			if (!$("#maitenancePage").is(":visible"))  {
				
				self.getAppVersion(function(v) {

					if (v === version)
						return;

					version = v;
					$('#new-version-notify').addClass('border');
					$rootScope.showNewVersionNotify = true;
					$interval.cancel(checkVersionInterval);
				});
			}
		};

		/**
		 * This will process health check result
		 */
		this.processHealthCheckResult = function(res) {
			if (res && res.ok && res.ok == true){
				return self.turnOff();
			}

			// if there is still an error then run again in given interval
			self.processHealthCheckFailResult(res);
		};

		/**
		 * This will schedule next health check
		 */
		this.processHealthCheckFailResult = function(res, err) {
			self.turnOn(res.status);

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
			if (healthCheckRunning) return false;
			healthCheckRunning = true;

			self.sendHealthCheck();
		};

		/**
		 * Turn on health check controll
		 */
		this.turnOn = function(statusCode) {
			$rootScope.$apply(function() {
				$rootScope.isMaintenanceMode = statusCode == 503;
			});

			// if already started, than stop
			if (healthCheckTimeoutPointer)
				return false;

			$("#maitenancePage").fadeIn();
			$rootScope.showNewVersionNotify = false;

		};

		this.turnOff = function() {
			healthCheckRunning = false;
			healthCheckTimeoutPointer = null;

			if (!$("#maitenancePage").is(":visible"))
				return false;

			// if app was not properly inited, reload page
			if(!$rootScope.initFinished) {
				window.location = document.URL;
			}
			
			$("#maitenancePage").fadeOut('fast', function() {
				self.checkVersion();
			});
		};

		// on init get actual version
		this.getAppVersion(function(v) {
			version = v;
		});

		checkVersionInterval = $interval(this.checkVersion, _check_interval);
	}
]);