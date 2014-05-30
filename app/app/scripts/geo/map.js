'use strict';

angular.module('hearth.geo').directive('map', [
	'geo', '$translate', '$filter',

	function(geo, $translate, $filter) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			scope: {
				'ads': '='
			},
			template: '<div id="map-canvas" style="height: 300px">map</div>',
			link: function(scope) {

				var map = geo.createMap($('#map-canvas')[0]),
					markers = [];
				geo.focusCurrentLocation();

				function placeMarker(location, ad) {
					var text = [
						'<div class="marker-tooltip">',
						'<a href="#ad/' + ad._id +'"><span class="fa fa-eye"></span></a>',
						'<span class="' + ad.type + '">' + $translate(ad.type.toUpperCase()) + '</span> ' + $filter('linky')(ad.title || ''),
						'<br>',
						$filter('linky')(ad.name || ''),
						'</div>'
					];

					var infowindow = new google.maps.InfoWindow({
							content: text.join('')
						}),
						marker = geo.placeMarker(geo.getLocationFromCoords(location.coordinates), ad.type);

					markers.push(marker);
					marker.setAnimation(google.maps.Animation.DROP);

					google.maps.event.addListener(marker, 'click', function() {
						infowindow.open(map, marker);
					});
				}

				function createPins(ads) {
					var i, j, ad, location;

					for (i = 0; i < ads.length; i++) {
						ad = ads[i];
						for (j = 0; j < ad.locations.length; j++) {
							location = ad.locations[j];
							if (location.coordinates) {
								placeMarker(location, ad);
							}
						}
					}
				}

				function clearMarkers() {
					for (var i = 0; i < markers.length; i++) {
						markers[i].setMap(null);
					}
					markers = [];
				}

				scope.$watch('ads', function() {
					clearMarkers();
					createPins(scope.ads);
				});
				scope.$watch('ads.length', function() {
					clearMarkers();
					createPins(scope.ads);
				});

			}
		};
	}
]);