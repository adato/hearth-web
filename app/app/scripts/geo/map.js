'use strict';

angular.module('hearth.geo').directive('map', [
	'geo', '$translate',
	function(geo, $translate) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			scope: {
				'ads': '='
			},
			template: '<div id="map-canvas" style="height: 300px">map</div>',
			link: function(scope) {
				var i, j, ad, location;

				var map = geo.createMap($('#map-canvas')[0]);
				geo.focusCurrentLocation();

				function placeMarker(location, add) {
					var text = [
						'<span class="' + add.type + '">' + $translate(add.type.toUpperCase()) + '</span> ' + (add.title || ''),
						'<br>', (add.name || '')
					];

					var infowindow = new google.maps.InfoWindow({
							content: text.join('')
						}),
						marker = geo.placeMarker(geo.getLocationFromCoords(location.coordinates), undefined, ad.type);
					marker.setAnimation(google.maps.Animation.DROP);

					google.maps.event.addListener(marker, 'click', function() {
						infowindow.open(map, marker);
					});
				}

				scope.$watch('ads.length', function() {
					for (i = 0; i < scope.ads.length; i++) {
						ad = scope.ads[i];
						for (j = 0; j < ad.locations.length; j++) {
							location = ad.locations[j];
							if (location.coordinates) {
								placeMarker(location, ad);
							}
						}
					}
				});

			}
		};
	}
]);