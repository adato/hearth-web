'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ApiHealthChecker
 * @description
 */

angular.module('hearth.services').factory('ApiHealthChecker', ['$rootScope', '$timeout', '$interval', '$window', function($rootScope, $timeout, $interval, $window) {

	const HEALTH_CHECK_TIMEOUT = 2000
	const CHECK_INTERVAL = 60000

	var healthCheckTimeoutPointer = null
	var healthCheckRunning = false
	var healthCheckRequestInProgress = false
	var version = null
	var checkVersionInterval = null
	var reloadRequired = false

	const factory = {
		checkOnlineState,
		closeNotify,
		shouldReload,
		sendFirstHealthCheck
	}

	init()

	return factory

	//////////////

	function init() {
		$rootScope.showNewVersionNotify = false

		// on init get actual version
		getAppVersion(v => {
			version = v
		})

		checkVersionInterval = $interval(checkVersion, CHECK_INTERVAL)
	}

	/**
	 * Close notification of maintenance message about new version
	 */
	function closeNotify() {
		$rootScope.showNewVersionNotify = false
	}

	/**
	 * Checkout actual app version
	 */
	function getAppVersion(done) {
		$.get('/version.txt').success(done)
	}

	/**
	 * Check version and optionally show notification
	 */
	function checkVersion() {
		if (!$("#maitenancePage").is(":visible")) {

			getAppVersion(v => {

				if (v === version) return

				version = v

				// on DEV we still want the nice message saying that a new version is available, but that's it
				// everywhere else -> the next router state change reloads the page
				if ($window.$$config.env === 'development') {
					$rootScope.showNewVersionNotify = true
				} else {
					reloadRequired = true
				}

				$interval.cancel(checkVersionInterval)
			})
		}
	}

	function checkOnlineState() {
		$rootScope.offlineHealthCheckInProgress = true
		clearTimeout(healthCheckTimeoutPointer)
		sendHealthCheck()
		// add small delay, so user can see that something is hapenning
		setTimeout(() => {
			$rootScope.offlineHealthCheckInProgress = false
		}, 1000)
	}

	/**
	 * This will process health check result
	 */
	function processHealthCheckResult(res) {
		healthCheckRequestInProgress = false

		if (res && res.ok && res.ok == true) return turnOff()

		// if there is still an error then run again in given interval
		processHealthCheckFailResult(res)
	}

	/**
	 * This will schedule next health check
	 */
	function processHealthCheckFailResult(res, err) {
		healthCheckRequestInProgress = false
		turnOn(res.status)

		healthCheckTimeoutPointer = setTimeout(sendHealthCheck, HEALTH_CHECK_TIMEOUT)
	}

	/**
	 * This will send health check request and process result
	 */
	function sendHealthCheck(res) {
		if (healthCheckRequestInProgress) return
		healthCheckRequestInProgress = true
		$.getJSON($$config.apiPath + '/health').done(processHealthCheckResult).fail(processHealthCheckFailResult)
	}

	/**
	 * Send first health check and manage locking
	 *  - eg only one health check will run at the time
	 */
	function sendFirstHealthCheck() {
		if (healthCheckRunning) return false
		healthCheckRunning = true

		sendHealthCheck()
	}

	function setOfflineMode() {
		$("#maitenancePage").hide()
		$rootScope.isMaintenanceMode = false
		$rootScope.isOfflineMode = true

		$.eventManager.disableAll($("*").not('.dont-disable'))

		$('a').on('click.myDisable', e => {
			e.preventDefault()
			return false
		})
	}

	function unsetOfflineMode() {
		$('a').off('click.myDisable')

		$.eventManager.enableAll($("*").not('.dont-disable'))
		$rootScope.isOfflineMode = false
		$rootScope.isMaintenanceMode = false
		$rootScope.$broadcast('ev:online')
	}

	function shouldReload() {
		return reloadRequired
	}

	/**
	 * Turn on health check controll
	 */
	function turnOn(statusCode) {
		$rootScope.$apply(() => {
			if (statusCode == 503) {
				$("#maitenancePage").fadeIn()
				$("#offlineNotify").hide()
				$rootScope.isMaintenanceMode = true
				$rootScope.isOfflineMode = false
			} else if (statusCode == 0) {
				setOfflineMode()
			}
		})

		// if already started, than stop
		if (healthCheckTimeoutPointer) return false

		// $("#maitenancePage").fadeIn()
		$rootScope.showNewVersionNotify = false
	}

	function turnOff() {
		healthCheckRunning = false
		healthCheckTimeoutPointer = null

		unsetOfflineMode()

		if (!$("#maitenancePage").is(":visible")) return false

		// if app was not properly inited, reload page
		if (!$rootScope.initFinished) window.location = document.URL

		$("#maitenancePage").fadeOut('fast', checkVersion)
	}

}])