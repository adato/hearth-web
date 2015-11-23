'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Karma
 * @description Working with carma
 */

angular.module('hearth.services').factory('Karma', [

	function($resource) {

		this.count = function(up, down) {
			up += 0;
			down += 0;

			if (up == 0 && down == 0) {
				return null;
			}

			if (up && !down) return 100;
			if (!up && down) return 0;

			return Math.round((up / (up + down)) * 100);
		};
		return this;
	}
]);
