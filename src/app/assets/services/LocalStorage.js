'use strict';

/**
 * @ngdoc factory
 * @name hearth.services.cookie
 * @description Factory for saving, getting and removing cookies
 */

angular.module('hearth.services').factory('LocalStorage', ['$window', function($window) {
	return {
		get: function(cname) {
			return $window.localStorage.getItem(cname);
		},
		set: function(cname, cvalue) {
			return $window.localStorage.setItem(cname, cvalue);
		},
		remove: function(cname) {
			return $window.localStorage.removeItem(cname);
		}
	};
}]);