'use strict';

/**
 * @ngdoc service
 * @name hearth.services.UnauthReload
 * @description UnauthReload service
 */

angular.module('hearth.services').service('UnauthReload', [
	'$translate', '$location', '$rootScope',
	function($translate, $location, $rootScope) {
		var self = this;
		var cookieName = 'reloadPath';

		/**
		 *  Check if user is logged - if no, throw him on login page
		 */
		this.checkAuth = function() {
			// if not logged
			if(!$rootScope.loggedUser || ! $rootScope.loggedUser._id) {

				// set return path and refresh on login
				$.cookie(cookieName, $location.path());
				$location.path('/login');
			}
		};

		/**
		 *  Check if user is logged - if no, throw him on login page
		 */
		this.check = function() {
			// check after user is loaded
			$rootScope.$on('initFinished', self.checkAuth);
			$rootScope.initFinished && self.checkAuth();
		};

		this.checkLocation = function() {
			var loc = $.cookie(cookieName);

			if(loc) {
				$location.path(loc);
				$.cookie(cookieName, '');
			}
		};

		return this;
	}
]);
