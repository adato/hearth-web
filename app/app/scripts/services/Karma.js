'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Karma
 * @description Working with carma
 */

angular.module('hearth.services').factory('Karma', [

	function($resource) {

		this.count = function(up, down) {

            if (up) {
                return Math.round((up / (up + down)) * 100);
            } else if (down) {
                return 0;
            } else {
                return null;
            }
		};
		return this;
	}
]);