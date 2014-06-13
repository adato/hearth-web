'use strict';

/**
 * @ngdoc directive
 * @name hearth.geo.locations
 * @description Renders fields for selecting location, and allows to select location.
 * @restrict E
 *
 * @requires $timeout
 * @requires geo
 */
angular.module('hearth.geo').directive('locations', [
	'geo', '$timeout',
	function(geo, $timeout) {
		return {
			restrict: 'A',
			replace: true,
			transclude: true,
			scope: {
				'locations': '='
			},
			templateUrl: 'templates/geo/locations.html',
			link: function(scope) {
				var marker, map, searchBox, editedLocationIndex,
					mapElement = $('#location-map #map'),
					searchBoxElement = $('#location-map  input'),
					initMap = function() {
						map = geo.createMap(mapElement[0], {
							draggableCursor: 'url(images/pin.png) 14 34, default'
						});
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
								position = geo.getLocationFromCoords(location.coordinates);

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
						marker = geo.placeMarker(position, 'pin', null, map);
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
]);