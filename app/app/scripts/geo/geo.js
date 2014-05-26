'use strict';

/**
 * @ngdoc service
 * @name hearth.geo.geo
 * @description google maps function wrapper
 * @requires $q
 * @requires $timeout
 */
angular.module('hearth.geo').factory('geo', [
	'$q', '$timeout',
	function($q) {
		var geocoder = new google.maps.Geocoder();
		return {

			/**
			 * @ngdoc function
			 * @methodOf hearth.geo.geo
			 * @name getCurrentLocation
			 * @description returns promise with data about current location
			 * @return {promise} Promise will be resolved with location google.maps.LatLng
			 */
			getCurrentLocation: function() {
				var deferred = $q.defer();

				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						deferred.resolve(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
					});
				}
				return deferred.promise;
			},

			/**
			 * @ngdoc function
			 * @methodOf hearth.geo.geo
			 * @param {google.maps.LatLng} location location
			 * @name getAddress
			 * @description returns promise with postal address data
			 * @return {promise} promise
			 */
			getAddress: function(location) {
				var deferred = $q.defer();

				geocoder.geocode({
					latLng: location
				}, function(responses) {
					if (responses && responses.length > 0) {
						deferred.resolve(responses[0].formatted_address);
					}
				});

				return deferred.promise;
			}
		};
	}
]);