'use strict';

angular.module('hearth.directives').directive('location', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/location.html',
		link: function(scope, el) {

			var marker, map, searchBox,
				element = $(el),

				initMap = function() {
					map = new google.maps.Map(element.children('#map-canvas')[0], {
						zoom: 6,
						zoomControl: true,
						mapTypeControl: false,
						streetViewControl: false,
						center: new google.maps.LatLng(0, 0)
					});
					google.maps.event.addListener(map, 'click', function(e) {
						placeMarker(e.latLng, map);
					});
						console.log(element.children('#mapsearch'));
					searchBox = new google.maps.places.SearchBox(element.children('input')[0]);
					google.maps.event.addListener(searchBox, 'places_changed', function() {
						placeMarker(searchBox.getPlaces()[0].geometry.location, map);
					});
					moveToCurrentLocation();
				},
				moveToCurrentLocation = function() {
					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(function(position) {
							placeMarker(new google.maps.LatLng(position.coords.latitude, position.coords.longitude), map);
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
				};

			$(document).on('opened', '#location-map[data-reveal]', function() {
				initMap();
			});

		}
	};
});