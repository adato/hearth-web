'use strict';

/**
 * @ngdoc service
 * @name hearth.geo.geo
 * @description google maps function wrapper
 *
 * @requires $q
 */
angular.module('hearth.geo').factory('geo', [
	'$q',
	function($q) {
		var geocoder = new google.maps.Geocoder(),
			mapConfig = {
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
			},
			_map,
			images = {
				need: {
					url: 'images/need.png',
					size: new google.maps.Size(29, 53),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(0, 53)
				},
				offer: {
					url: 'images/offer.png',
					size: new google.maps.Size(29, 53),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(0, 29)
				}
			};

		return {

			/**
			 * @ngdoc function
			 * @name getCurrentLocation
			 * @methodOf hearth.geo.geo
			 * @description Returns promise with data about current location
			 *
			 * @return {promise} Promise will be resolved with location google.maps.LatLng
			 */
			getCurrentLocation: function() {
				var me = this,
					deferred = $q.defer();

				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						deferred.resolve(me.getLocationFromCoords([position.coords.longitude, position.coords.latitude]));
					});
				}
				return deferred.promise;
			},

			/**
			 * @ngdoc function
			 * @name getAddress
			 * @methodOf hearth.geo.geo
			 * @param {google.maps.LatLng} location location
			 * @description Returns promise with postal address data
			 *
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

			/**
			 * @ngdoc function
			 * @name createMap
			 * @methodOf hearth.geo.geo
			 * @param {DOMelement} element location
			 * @description Returns creates Google map and returns reference to map (and saves reference to _map)
			 *
			 * @return {google.maps.Map} map
			 */
			createMap: function(element) {
				_map = new google.maps.Map(element, mapConfig);

				return _map;
			},

			/**
			 * @ngdoc function
			 * @name focusCurrentLocation
			 * @methodOf hearth.geo.geo
			 * @description Centers map to current location
			 *
			 * @param {google.maps.Map} element map (optional) - if not set, last created map will be used
			 *
			 * @return {google.maps.Map} map
			 */
			focusCurrentLocation: function(map) {
				var me = this;

				this.getCurrentLocation().then(function(location) {
					me.focusLocation(location, map);
				});
			},

			/**
			 * @ngdoc function
			 * @name focusCurrentLocation
			 * @methodOf hearth.geo.geo
			 * @description Centers map to  location
			 *
			 * @param {google.maps.LatLng} location location of map center
			 * @param {google.maps.Map} map (optional)  - if not set, last created map will be used
			 */
			focusLocation: function(location, map) {
				(map || _map).setCenter(location);
			},

			/**
			 * @ngdoc function
			 * @name placeMarker
			 * @methodOf hearth.geo.geo
			 * @description Places marker to location
			 *
			 * @param {google.maps.LatLng} location of map center
			 * @param {String} type  type of icon ('need', 'offer', 'undefined')
			 * @param {google.maps.Map} map (optional)  - if not set, last created map will be used
			 */
			placeMarker: function(location, type, map) {
				return new google.maps.Marker({
					position: location,
					map: map || _map,
					icon: images[type]
				});
			},

			/**
			 * @ngdoc function
			 * @name placeMarker
			 * @methodOf hearth.geo.geo
			 * @description Converts coordinates array to google.maps.LatLng
			 *
			 * @param {Array} coordinates location of map center
			 *
			 * @return {google.maps.LatLng} location
			 */
			getLocationFromCoords: function(coordinates) {
				if (coordinates) {
					return new google.maps.LatLng(coordinates[1], coordinates[0]);
				} else {
					throw 'Unable to convert coordinates';
				}
			},

			/**
			 * @ngdoc function
			 * @name placeMarker
			 * @methodOf hearth.geo.geo
			 * @description Counts distance between two locations
			 *
			 * @param {google.maps.LatLng} position1 position1
			 * @param {google.maps.LatLng} position2 position2
			 *
			 * @return {number} distance in km
			 */
			getDistance: function(position1, position2) {
				var R = 6371,
					a, c, d, dLat, dLon, deg2rad = function(deg) {
						return deg * (Math.PI / 180);
					};

				if (position1 && position2) {

					dLat = deg2rad(position2.lat() - position1.lat());
					dLon = deg2rad(position2.lng() - position1.lng());
					a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(position1.lat())) * Math.cos(deg2rad(position2.lat())) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
					c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
					d = R * c;
					return d;
				} else {
					throw 'Unable to count distances of';
				}
			}
		};
	}
]);