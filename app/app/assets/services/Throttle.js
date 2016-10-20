'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Throttle
 * @description throttle function
 */

angular.module('hearth.services').service('Throttle', [
	function() {
		this.go = function(callback, limit) {
			var wait = false;
			limit = limit || 10;
			return function() {
				if (!wait) {
					callback.call();
					wait = true;
					setTimeout(function() {
						wait = false;
					}, limit);
				}
			}
		};
	}
]);