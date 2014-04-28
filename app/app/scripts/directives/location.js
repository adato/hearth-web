'use strict';

angular.module('hearth.directives').directive('location', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/location.html',
		link: function(scope, el) {
			var marker,
				searchBox = new google.maps.places.SearchBox($(el).children('input')[0]),
				map = new google.maps.Map($(el).children('#map-canvas')[0], {
					zoom: 6,
					zoomControl: true,
					mapTypeControl: false,
					streetViewControl: false,
					center: new google.maps.LatLng(0, 0)
				}),
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

			google.maps.event.addListener(map, 'click', function(e) {
				placeMarker(e.latLng, map);
			});
			google.maps.event.addListener(searchBox, 'places_changed', function() {
				var places = searchBox.getPlaces();

				placeMarker(places[0].geometry.location, map);
			});

			moveToCurrentLocation();

		}
	};
});