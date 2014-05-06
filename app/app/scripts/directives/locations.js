'use strict';

/**
 * @ngdoc directive
 * @name locations
 * @description Renders fields for selecting location, and allows to select location.
 * @restrict E
 */
angular.module('hearth.directives').directive('locations', [
	'geo',
	function(geo) {
		return {
			restrict: 'A',
			replace: true,
			transclude: true,
			scope: {
				'locations': '='
			},
			templateUrl: 'templates/locations.html',
			link: function(scope, el, attrs) {
				var marker, map, searchBox, selectedPosition, selectedName, position, editedLocationIndex,
					element = $(el),
					mapElement = $('#location-map #map-canvas'),
					inputElement = $('#location-map  input'),
					geocoder = new google.maps.Geocoder(),
					initMap = function() {
						map = new google.maps.Map(mapElement[0], {
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
						});
						google.maps.event.addListener(map, 'click', function(e) {
							placeMarker(e.latLng, map);
							geo.getAddress(e.latLng).then(function(address) {
								selectedName = address;
								inputElement.val(address);
							});
						});
						searchBox = new google.maps.places.SearchBox(inputElement[0]);
						google.maps.event.addListener(searchBox, 'places_changed', function() {
							selectedName = searchBox.getPlaces()[0].formatted_address;
							placeMarker(searchBox.getPlaces()[0].geometry.location, map);
						});

						if (editedLocationIndex !== undefined && scope.locations[editedLocationIndex].coordinates) {
							var location = scope.locations[editedLocationIndex],
								coords = location.coordinates;

							position = new google.maps.LatLng(coords[1], coords[0])
							selectedName = location.name;
							inputElement.val(selectedName);
							placeMarker(position, map);
						} else {
							geo.getCurrentLocation().then(function(position) {
								placeMarker(position, map);
								geo.getAddress(position).then(function(address) {
									selectedName = address;
									inputElement.val(address);
								});
							});
						}
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
						selectedPosition = position;
					};

				scope.editLocation = function(index) {
					$('#location-map').foundation('reveal', 'open');
					editedLocationIndex = index;
				}

				$(document).on('opened', '#location-map[data-reveal]', function() {
					initMap();
				});

				$('button', element).click(function() {
					scope.$apply(function() {
						scope.locations[editedLocationIndex] = {
							type: 'Point',
							name: selectedName,
							coordinates: [
								selectedPosition.A,
								selectedPosition.k
							]
						};
					})
					$('#location-map').foundation('reveal', 'close');
					$('.pac-container').remove(); //google maps forget this
				});
			}
		}
	}
])
/**
 * @ngdoc service
 * @name geo
 * @description google maps function wrapper
 */
.factory('geo', [
	'$q', '$timeout',
	function($q, $timeout) {
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