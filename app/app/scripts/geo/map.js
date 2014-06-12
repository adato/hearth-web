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
				var markerCluster,
					infoWindow = new google.maps.InfoWindow(),
					template = $interpolate($templateCache.get('templates/geo/markerTooltip.html')[1]),
					map = geo.createMap(element[0], {
						zoom: 11
					}),
					oms = new OverlappingMarkerSpiderfier(map, {
						markersWontMove: true,
						markersWontHide: true
					}),
					markerCache = {},
					markers = [],
					placeMarker = function(location, ad) {

						ad.author.avatar.normal = ad.author.avatar.normal || EMPTY_AVATAR_URL;
						if (ad.community_id) {
							ad.adType = ad.type === 'need' ? 'WE_NEED' : 'WE_GIVE';
						} else {
							ad.adType = ad.type;
						}
						var marker = geo.placeMarker(geo.getLocationFromCoords(location.coordinates), ad.type, template(ad));
						oms.addMarker(marker);
						markerCache[ad._id] = marker;
						markers.push(marker);
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
						markerCluster = new MarkerClusterer(map, markers, {
							maxZoom: 14,
							size: 40
						});
					},
					clearMarkerCache = function() {
						for (var key in markerCache) {
							markerCache[key].setMap(null);
						}
						markerCache = [];
					};

				oms.addListener('click', function(marker) {
					infoWindow.setContent(marker.desc);
					infoWindow.open(map, marker);
					$('.marker-tooltip').click(function() {
						window.location.href = '#ad/' + $(this).attr('itemid');
					});
				});
				scope.$on('keywordSearch', function() {
					clearMarkerCache();
				});

				google.maps.event.addListener(map, 'bounds_changed', function() {
					scope.$emit('mapBoundsChange', map.getBounds());
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