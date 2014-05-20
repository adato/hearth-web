'use strict';

angular.module('hearth.services').service('Geocoder', [
	'$window', '$q', '$rootScope',
	function($window, $q, $rootScope) {
		var deg2rad, that;
		that = this;
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
		this.geoJsonToLatLon = function(geoJson) {
			var latlon;
			if (geoJson == null) {
				return null;
			}
			if ((geoJson.lat != null) && (geoJson.lon != null)) {
				return geoJson;
			}
			if (geoJson.coordinates != null) {
				latlon = {
					name: '',
					lon: geoJson.coordinates[0],
					lat: geoJson.coordinates[1]
				};
				if (geoJson.name != null) {
					latlon.name = geoJson.name;
				}
				return latlon;
			}
		};
		this.latLonToGeoJson = function(latlon) {
			var geojson;
			if (latlon.type === 'Point') {
				return latlon;
			}
			if ((latlon.lat != null) && (latlon.lon != null)) {
				geojson = {
					type: 'Point',
					name: '',
					coordinates: [latlon.lon, latlon.lat]
				};
			}
			if (latlon.name != null) {
				geojson.name = latlon.name;
			}
			return geojson;
		};
		this.getDistance = function(position1, position2) {
			var R, a, c, d, dLat, dLon;
			if (position1 === undefined || position1 === null || position1 === 0 || position1 === '') {
				return;
			}
			if (position2 === undefined || position2 === null || position2 === 0 || position2 === '') {
				return;
			}
			if (!position1.lat || !position1.lon || !position2.lat || !position2.lon) {
				return;
			}
			R = 6371;
			dLat = deg2rad(position2.lat - position1.lat);
			dLon = deg2rad(position2.lon - position1.lon);
			a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(position1.lat)) * Math.cos(deg2rad(position2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
			c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			d = R * c;
			return d;
		};
		deg2rad = function(deg) {
			return deg * (Math.PI / 180);
		};
		return this;
	}
]);