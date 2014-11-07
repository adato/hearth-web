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

        		var destroy = $rootScope.$on('$routeChangeSuccess', function() {
		            setTimeout(function() {
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

			if(loc) {
				$location.path(loc);
				$.cookie(cookieName, '');
			}
		};

		this.getLocation = function() {
			return $.cookie(cookieName);
		};

		return this;
	}
]);
