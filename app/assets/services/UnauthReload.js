'use strict';

/**
 * @ngdoc service
 * @name hearth.services.UnauthReload
 * @description UnauthReload service
 */

angular.module('hearth.services').service('UnauthReload', [
	'$translate', '$location', '$rootScope', '$timeout', '$window',
	function($translate, $location, $rootScope, $timeout, $window) {
		var self = this;
		var cookieName = 'reloadPath';

		self.saveLocation = function() {
			// set the return path for unlogged user
			if (! ($rootScope.loggedUser && $rootScope.loggedUser._id)) {
				$rootScope.loginRequired = true;				
				self.setLocation($location.path())

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
		self.check = function() {
			// check after user is loaded

			$rootScope.$on('initFinished', self.saveLocation);
			$rootScope.initFinished && self.saveLocation();
		};

		self.goToSavedLocationIfAny = function() {
			var loc = self.getLocation();
			
			if (loc) {
				if (loc.indexOf('app/') > -1) {
					loc = loc.replace('app/', '');
				}
				if (loc.indexOf('//') > -1) {
					loc = loc.replace('//', '/');
				}
				if (loc.indexOf('%2F') > -1) {
					loc = loc.replace(/\%2F/gi, '/');
				}
				if (loc.indexOf('%252F') > -1) {
					loc = loc.replace(/\%252F/gi, '/');
				}
				if (loc[0] == '/') {
					loc = loc.substr(1);
			    }
				$timeout(() => {
					//$window.location.replace(loc);
					$location.path(loc);
					self.clearReloadLocation();
				}, 100);
				return true;
			} else return false;
		};

		self.clearReloadLocation = function() {
			$.cookie(cookieName, '', {
				path: '/'
			});
		};

		self.getLocation = function() {
			let cookie = $.cookie(cookieName);
			return cookie;
		};

		self.setLocation = path => {
			$.cookie(cookieName, path, {path: '/'});
		}

	}
]);