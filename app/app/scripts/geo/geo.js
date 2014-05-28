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
			},

			createMap: function(element) {
				var mapConfig = {
					zoom: 6,
					zoomControl: true,
					mapTypeControl: false,
					streetViewControl: false,
					center: new google.maps.LatLng(0, 0),
					draggableCursor: 'crosshair',
					zoomControlOptions: {
						style: google.maps.ZoomControlStyle.LARGE,
						position: google.maps.ControlPosition.LEFT_CENTER
					}
				};
				return new google.maps.Map(element, mapConfig);
			},

			focusCurrentLocation: function(map) {
				this.getCurrentLocation().then(function(position) {
					map.setCenter(position);
				});
			},

			placeMarker: function(map, location) {
				return new google.maps.Marker({
					position: location,
					map: map
				});
			}
		};
	}
]);