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
		var geocoder = new google.maps.Geocoder(),
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
				_map = new google.maps.Map(element, mapConfig);
				return _map;
			},

			focusCurrentLocation: function(map) {
				this.getCurrentLocation().then(function(position) {
					(map || _map).setCenter(position);
				});
			},

			focusLocation: function(position, map) {
				(map || _map).setCenter(position);
			},

			placeMarker: function(location, map, type) {
				return new google.maps.Marker({
					position: location,
					map: map || _map,
					icon: images[type]
				});
			},

			getLocationFromCoords: function(coords) {
				return new google.maps.LatLng(coords[1], coords[0]);
			}

		};
	}
]);