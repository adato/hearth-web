'use strict';

/**
 * @ngdoc service
 * @name hearth.services.UnauthReload
 * @description UnauthReload service
 */

angular.module('hearth.services').service('UnauthReload', [
	'$translate', '$location', '$rootScope', '$timeout',
	function($translate, $location, $rootScope, $timeout) {
		var self = this;
		var cookieName = 'reloadPath';

		/**
		 *  Check if user is logged - if no, throw him on login page
		 */
		this.checkAuth = function() {
			// if not logged
			if (!$rootScope.loggedUser || !$rootScope.loggedUser._id) {
				$rootScope.loginRequired = true;
				// set return path and refresh on login
				$.cookie(cookieName, $location.path().slice(1), {
					path: '/'
				});
				$location.path('login');

				var destroy = $rootScope.$on('$routeChangeSuccess', function() {
					$timeout(function() {
						$rootScope.$broadcast('loginRequired');
						destroy();
					});
				});
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
			var loc = self.getLocation();

			if (loc) {
				$location.path(loc);
				self.clearReloadLocation();
			}
		};

		this.clearReloadLocation = function() {
			$.cookie(cookieName, '', {
				path: '/'
			});
		};

		this.getLocation = function() {
			return $.cookie(cookieName);
		};

		return this;
	}
]);
