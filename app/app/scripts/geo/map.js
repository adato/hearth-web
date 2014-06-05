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
 */
angular.module('hearth.geo').directive('map', [
	'geo', '$interpolate', '$templateCache',

	function(geo, $interpolate, $templateCache) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			scope: {
				'ads': '='
			},
			link: function(scope, element) {
				var infowindow,
					centerChangeTimeout,
					template = $interpolate($templateCache.get('templates/geo/markerTooltip.html')[1]),
					map = geo.createMap(element[0], {
						zoom: 9
					}),
					markerCache = {},

					placeMarker = function(location, ad) {
						if (infowindow) {
							infowindow.close();
						}
						infowindow = new google.maps.InfoWindow({
							content: template(ad)
						});
						var marker = geo.placeMarker(geo.getLocationFromCoords(location.coordinates), ad.type);

						marker.setAnimation(google.maps.Animation.DROP);
						google.maps.event.addListener(marker, 'click', function() {
							infowindow.open(map, marker);
						});
						markerCache[ad._id] = marker;
					},
					createPins = function(ads) {
						var i, j, ad, location;
						ads = ads || [];

						for (i = 0; i < ads.length; i++) {
							ad = ads[i];
							if (!markerCache[ad._id]) {
								for (j = 0; j < ad.locations.length; j++) {
									location = ad.locations[j];
									if (location.coordinates) {
										placeMarker(location, ad);
									}
								}
							}
						}
					};

				google.maps.event.addListener(map, 'center_changed', function() {
					window.clearTimeout(centerChangeTimeout);
					centerChangeTimeout = window.setTimeout(function() {
						scope.$emit('mapcenterchange', map.getCenter());
					}, 2000);
				});
				scope.$watch('ads', function() {
					createPins(scope.ads);
				});
				scope.$watch('ads.length', function() {
					createPins(scope.ads);
				});
				geo.focusCurrentLocation();
			}
		};
	}
]);