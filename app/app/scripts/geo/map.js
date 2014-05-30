'use strict';

/**
 * @ngdoc directive
 * @name hearth.geo.map
 * @description Renders Map with pins
 *
 * @restrict E
 * @requires geo
 * @requires $interpolate
 * @requires $templateCache
 * @requires $http
 */
angular.module('hearth.geo').directive('map', [
	'geo', '$interpolate', '$templateCache', '$http',

	function(geo, $interpolate, $templateCache, $http) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			scope: {
				'ads': '='
			},
			template: '<div id="map-canvas" style="height: 300px">map</div>',
			link: function(scope, element) {
				var template,
					map = geo.createMap(element[0]),
					markers = [];

				function createTemplateFromCache() {
					template = $interpolate($templateCache.get('templates/geo/markerTooltip.html')[1]);
				}

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

				if (!$templateCache.get('templates/geo/markerTooltip.html')) {
					$http.get('templates/geo/markerTooltip.html', {
						cache: $templateCache
					}).success(function() {
						createTemplateFromCache();
					});
				} else {
					createTemplateFromCache();
				}
				geo.focusCurrentLocation();
			}
		};
	}
]);