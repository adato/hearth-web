'use strict';

angular.module('hearth.directives').directive('location', function() {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'templates/location.html',
		link: function(scope, el, attrs) {
			var map,
				marker,
				markers = [],
				searchField = $(el).children('input'),
				mapOptions = {
					zoom: 6,
					zoomControl: true,
					mapTypeControl: false,
					streetViewControl: false,
					center: new google.maps.LatLng(0, 0)
				},
				searchBox = new google.maps.places.SearchBox(searchField[0]);

			map = new google.maps.Map($(el).children('#map-canvas')[0], mapOptions);

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

					map.setCenter(position);
					marker = new google.maps.Marker({
						position: position,
						map: map
					});
				});
			}

			google.maps.event.addListener(map, 'click', function(e) {
				placeMarker(e.latLng, map);
			});

			function placeMarker(position, map) {
				if (marker) {
					marker.setMap(null);
				}
				marker = new google.maps.Marker({
					position: position,
					map: map
				});

				map.panTo(position);
			}
			google.maps.event.addListener(searchBox, 'places_changed', function() {
				var places = searchBox.getPlaces();

				for (var i = 0, marker; marker = markers[i]; i++) {
					marker.setMap(null);
				}

				markers = [];
				var bounds = new google.maps.LatLngBounds();
				for (var i = 0, place; place = places[i]; i++) {
					var image = {
						url: place.icon,
						size: new google.maps.Size(71, 71),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(17, 34),
						scaledSize: new google.maps.Size(25, 25)
					};

					var marker = new google.maps.Marker({
						map: map,
						icon: image,
						title: place.name,
						position: place.geometry.location
					});

					markers.push(marker);

					bounds.extend(place.geometry.location);
				}

				map.fitBounds(bounds);
			});

		}
	};
});