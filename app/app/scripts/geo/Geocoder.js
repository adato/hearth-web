'use strict';

/**
 * @ngdoc service
 * @name hearth.geo.Geocoder
 * @description
 * @requires $window
 * @requires $q
 * @requires $rootScope
 */

angular.module('hearth.geo').service('Geocoder', [
	'$window', '$q', '$rootScope',
	function($window, $q, $rootScope) {
		var deg2rad, that;
		that = this;

		/**
		 * @ngdoc function
		 * @methodOf hearth.geo.Geocoder
		 * @name findMe
		 * @description
		 */
		this.findMe = function() {
			var deferred;
			deferred = $q.defer();
			if ($window.navigator.geolocation) {
				$window.navigator.geolocation.getCurrentPosition(function(position) {
					var location;
					location = {
						lat: position.coords.latitude,
						lon: position.coords.longitude
					};
					return $rootScope.$apply(function() {
						return deferred.resolve(location);
					});
				}, function(err) {
					return deferred.reject(err);
				}, {
					maximumAge: 60000,
					timeout: 5000,
					enableHighAccuracy: true
				});
			}
			return deferred.promise;
		};
		/**
		 * @ngdoc function
		 * @methodOf hearth.geo.Geocoder
		 * @name geocoder
		 * @description
		 */
		this.geocoder = function(position) {
			var deferred, geocoder, latlng;
			deferred = $q.defer();
			geocoder = new google.maps.Geocoder();
			latlng = new google.maps.LatLng(position.lat, position.lon);
			geocoder.geocode({
				'latLng': latlng
			}, function(results, status) {
				var location;
				if (status === google.maps.GeocoderStatus.OK) {
					location = {
						lat: position.lat,
						lon: position.lon,
						name: results[1].formatted_address
					};
					return $rootScope.$apply(function() {
						return deferred.resolve(location);
					});
				} else {
					return deferred.reject(status);
				}
			});
			return deferred.promise;
		};

		/**
		 * @ngdoc function
		 * @methodOf hearth.geo.Geocoder
		 * @name findMeAndGeocode
		 * @description
		 */
		this.findMeAndGeocode = function() {
			var deferred;
			deferred = $q.defer();
			this.findMe().then(function(myLocation) {
				return that.geocoder(myLocation);
			}).then(function(geocoded) {
				return deferred.resolve(geocoded);
			});
			return deferred.promise;
		};

		/**
		 * @ngdoc function
		 * @methodOf hearth.geo.Geocoder
		 * @name geoJsonToLatLon
		 * @description
		 */
		this.geoJsonToLatLon = function(geoJson) {
			var latlon;
			if (!geoJson) {
				return null;
			}
			if (geoJson.lat && geoJson.lon) {
				return geoJson;
			}
			if (geoJson.coordinates) {
				latlon = {
					name: '',
					lon: geoJson.coordinates[0],
					lat: geoJson.coordinates[1]
				};
				if (geoJson.name) {
					latlon.name = geoJson.name;
				}
				return latlon;
			}
		};

		/**
		 * @ngdoc function
		 * @methodOf hearth.geo.Geocoder
		 * @name latLonToGeoJson
		 * @description
		 */
		this.latLonToGeoJson = function(latlon) {
			var geojson;
			if (latlon.type === 'Point') {
				return latlon;
			}
			if (latlon.lat && latlon.lon) {
				geojson = {
					type: 'Point',
					name: '',
					coordinates: [latlon.lon, latlon.lat]
				};
			}
			if (latlon.name) {
				geojson.name = latlon.name;
			}
			return geojson;
		};

		return this;
	}
]);