'use strict';

/**
 * @ngdoc service
 * @name hearth.services.UnauthReload
 * @description UnauthReload service
 */

angular.module('hearth.services').service('UnauthReload', [
	'$translate', '$location', '$rootScope', '$timeout', '$state',
	function($translate, $location, $rootScope, $timeout, $state) {
		var self = this;
		var cookieName = 'reloadPath';

		/**
		 *  Check if user is logged - if no, throw him on login page
		 */
		self.checkAuth = function() {
			// if not logged
			if (! ($rootScope.loggedUser && $rootScope.loggedUser._id)) {
				$rootScope.loginRequired = true;

				// set return path and refresh on login
				// console.log($location.path(), $location.path().slice(1));
				self.setLocation($location.path().slice(1))

				// $location.path('login');
				// $state.go('login', {
				// 	location: 'replace'
				// });

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
			$rootScope.$on('initFinished', self.checkAuth);
			$rootScope.initFinished && self.checkAuth();
		};

		self.checkLocation = function() {
			var loc = self.getLocation();

			if (loc) {
				$location.path(loc);
				self.clearReloadLocation();
			}
		};

		self.clearReloadLocation = function() {
			$.cookie(cookieName, '', {
				path: '/'
			});
		};

		self.getLocation = function() {
			return $.cookie(cookieName);
		};

		self.setLocation = path => $.cookie(cookieName, path, {path: '/'});

	}
]);