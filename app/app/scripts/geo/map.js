'use strict';

angular.module('hearth.geo').directive('map', [
	'geo', '$translate', '$filter', '$interpolate',

	function(geo, $translate, $filter, $interpolate) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			scope: {
				'ads': '='
			},
			template: '<div id="map-canvas" style="height: 300px">map</div>',
			link: function(scope, element) {
				var map = geo.createMap(element[0]),
					markers = [];
				geo.focusCurrentLocation();

				var template = $interpolate(['<div class="marker-tooltip">',
					'<a href="#ad/{{_id}}"><span class="fa fa-eye"></span></a>',
					'<span class="{{type}}">{{type.toUpperCase() | translate}}</span> {{title|linky}}',
					'<br>',
					'{{name|linky}}',
					'</div>'
				].join(''));

				function placeMarker(location, ad) {
					var infowindow = new google.maps.InfoWindow({
							content: template(ad)
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