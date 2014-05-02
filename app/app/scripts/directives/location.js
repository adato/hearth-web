'use strict';

angular.module('hearth.directives').directive('location', function(geo) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/location.html',
		link: function(scope, el, attrs) {
			var marker, map, searchBox, selectedPosition, selectedName,
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
					});
					searchBox = new google.maps.places.SearchBox(element.children('input')[0]);
					google.maps.event.addListener(searchBox, 'places_changed', function() {
						placeMarker(searchBox.getPlaces()[0].geometry.location, map);
					});

					var position = scope.editedLocationIndex !== undefined ? attrs.locations[scope.editedLocationIndex].coordinates : undefined;

					if (position) {
						placeMarker(new google.maps.LatLng(position[1], position[0]), map);
					} else {
						geo.getCurrentLocation().then(function(position) {
							placeMarker(position, map);
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

					geo.getAddress(position).then(function(address) {
						selectedName = address;
					});
				};

			$(document).on('opened', '#location-map[data-reveal]', function() {
				initMap();
			});

			$('button', element).click(function() {
				scope.endLocationEdit([
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