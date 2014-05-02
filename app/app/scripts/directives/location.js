'use strict';

angular.module('hearth.directives').directive('location', function(geo) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/location.html',
		scope: {
			locations: '='
		},
		link: function(scope, el, attrs) {
			var marker, map, searchBox, selectedPosition, selectedName, position,
				element = $(el),
				geocoder = new google.maps.Geocoder(),
				initMap = function() {
					map = new google.maps.Map(element.children('#map-canvas')[0], {
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
							element.children('input').val(address);
						});
					});
					searchBox = new google.maps.places.SearchBox(element.children('input')[0]);
					google.maps.event.addListener(searchBox, 'places_changed', function() {
						selectedName = searchBox.getPlaces()[0].formatted_address;
						placeMarker(searchBox.getPlaces()[0].geometry.location, map);
					});

					if (scope.$parent.editedLocationIndex !== undefined && scope.locations[scope.$parent.editedLocationIndex].coordinates) {
						var location = scope.locations[scope.$parent.editedLocationIndex],
							coords = location.coordinates;

						position = new google.maps.LatLng(coords[1], coords[0])
						selectedName = location.name;
						element.children('input').val(selectedName);
						placeMarker(position, map);
					} else {
						geo.getCurrentLocation().then(function(position) {
							placeMarker(position, map);
							geo.getAddress(position).then(function(address) {
								selectedName = address;
								element.children('input').val(address);
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

			$(document).on('opened', '#location-map[data-reveal]', function() {
				initMap();
			});

			$('button', element).click(function() {
				scope.$parent.endLocationEdit([
					selectedPosition.A,
					selectedPosition.k
				], selectedName);
				$('#location-map').foundation('reveal', 'close');
			});

		}
	};
}).factory('geo', [
	'$q', '$timeout',
	function($q, $timeout) {
		var geocoder = new google.maps.Geocoder();
		return {

			getCurrentLocation: function() {
				var deferred = $q.defer();

				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						deferred.resolve(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
					});
				}
				return deferred.promise;
			},

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