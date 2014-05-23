'use strict';

/**
 * @ngdoc directive
 * @name locations
 * @description Renders fields for selecting location, and allows to select location.
 * @restrict E
 */
angular.module('hearth.directives').directive('locations', [
	'geo', '$timeout',
	function(geo, $timeout) {
		return {
			restrict: 'A',
			replace: true,
			transclude: true,
			scope: {
				'locations': '='
			},
			templateUrl: 'templates/locations.html',
			link: function(scope) {
				var marker, map, searchBox, editedLocationIndex,
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
						},
					},
					mapElement = $('#location-map #map-canvas'),
					searchBoxElement = $('#location-map  input'),
					initMap = function() {
						map = new google.maps.Map(mapElement[0], mapConfig);
						searchBox = new google.maps.places.SearchBox(searchBoxElement[0]);

						google.maps.event.addListener(map, 'click', function(e) {
							placeMarker(e.latLng, map);
							geo.getAddress(e.latLng).then(function(address) {
								scope.selectedName = address;
								searchBoxElement.val(address);
							});
						});
						searchBoxElement.blur(function() {
							var places = searchBox.getPlaces();
							if (!places) {
								clearLocation();
							}
						});
						google.maps.event.addListener(searchBox, 'places_changed', function() {
							var places = searchBox.getPlaces();

							if (places && places.length > 0) {
								scope.$apply(function() {
									setLocation(places[0].formatted_address, places[0].geometry.location);
								});
								placeMarker(places[0].geometry.location, map);
							} else {
								clearLocation();
							}
						});
						searchBoxElement.change(function() {
							if (!searchBoxElement.val()) {
								clearLocation();
							}
						});

						if (editedLocationIndex !== undefined && scope.locations[editedLocationIndex].coordinates) {
							var location = scope.locations[editedLocationIndex],
								coords = location.coordinates,
								position = new google.maps.LatLng(coords[1], coords[0]);

							scope.$apply(function() {
								setLocation(location.name, position);
							});
							searchBoxElement.val(location.name);
							placeMarker(position, map);
						} else {
							geo.getCurrentLocation().then(function(position) {
								placeMarker(position, map);
								geo.getAddress(position).then(function(address) {
									$timeout(function() {
										setLocation(address, position);
									});
									searchBoxElement.val(address);
								});
							});
						}
					},
					clearLocation = function() {
						scope.$apply(function() {
							setLocation('', []);
						});
						if (marker) {
							marker.setMap(null);
						}
					},
					setLocation = function(address, position) {
						scope.selectedName = address;
						scope.selectedPosition = position;
					},
					placeMarker = function(position, map) {
						if (marker) {
							marker.setMap(null);
						}
						marker = new google.maps.Marker({
							position: position,
							map: map
						});
						map.panTo(position);
						scope.selectedPosition = position;
					};

				scope.editLocation = function(index) {
					$('#location-map').foundation('reveal', 'open');
					editedLocationIndex = index;
				};

				$(document).on('opened', '#location-map[data-reveal]', function() {
					initMap();
				});

				$('button', '#location-map').unbind('click');
				$('button', '#location-map').click(function() {
					scope.$apply(function() {
						scope.locations[editedLocationIndex] = {
							type: 'Point',
							name: scope.selectedName,
							coordinates: [
								scope.selectedPosition.lng(),
								scope.selectedPosition.lat()
							]
						};
					});
					$('#location-map').foundation('reveal', 'close');
					$('.pac-container').remove(); //google maps forget this
				});
			}
		};
	}
])
/**
 * @ngdoc service
 * @name geo
 * @description google maps function wrapper
 */
.factory('geo', [
	'$q', '$timeout',
	function($q) {
		var geocoder = new google.maps.Geocoder();
		return {
			/**
			 * @ngdoc function
			 * @methodOf geo
			 * @name getCurrentLocation
			 * @description returns promise with data about current location
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
			 * @methodOf geo
			 * @param {google.maps.LatLng} position position
			 * @name getAddress
			 * @description returns promise with postal address data
			 */
			getAddress: function(position) {
				var deferred = $q.defer();

				geocoder.geocode({
					latLng: position
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