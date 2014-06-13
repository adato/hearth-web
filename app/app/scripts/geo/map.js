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
	'geo', '$interpolate', '$templateCache', '$location', '$route',

	function(geo, $interpolate, $templateCache, $location, $route) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
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
					markerCluster = new MarkerClusterer(map, markers, {
						ignoreHidden: true,
						maxZoom: 14,
						size: 20
					}),
					placeMarker = function(location, ad) {
						var marker = markerCache[ad._id];

						if (marker) {
							marker.setVisible(true);
						} else {
							ad.author.avatar.normal = ad.author.avatar.normal || EMPTY_AVATAR_URL;
							if (ad.community_id) {
								ad.adType = ad.type === 'need' ? 'WE_NEED' : 'WE_GIVE';
							} else {
								ad.adType = ad.type;
							}
							marker = geo.placeMarker(geo.getLocationFromCoords(location.coordinates), ad.type, template(ad));
							oms.addMarker(marker);
							markerCache[ad._id] = marker;
							markers.push(marker);
							markerCluster.addMarkers(markers);
						}
					},
					createPins = function(ads) {
						var i, j, ad, location;
						ads = ads || [];

						for (i = 0; i < ads.length; i++) {
							ad = ads[i];
							for (j = 0; j < ad.locations.length; j++) {
								location = ad.locations[j];
								if (location.coordinates) {
									placeMarker(location, ad);
								}
							}
						}
						markerCluster.repaint();
					},
					hideMarkers = function() {
						for (var i = 0; i < markers.length; i++) {
							markers[i].setVisible(false);
						}
					};

				oms.addListener('click', function(marker) {
					infoWindow.setContent(marker.desc);
					infoWindow.open(map, marker);
					$('.marker-tooltip').click(function() {
						var itemId = $(this).attr('itemid');

						scope.$apply(function() {
							var path = $location.path('ad/' + itemId);
						});
					});
				});
				scope.$on('keywordSearch', function() {
					hideMarkers();
				});
				scope.$on('searchByLoc', function(e, ads) {
					createPins(ads);
				});
				google.maps.event.addListener(map, 'bounds_changed', function() {
					scope.$emit('mapBoundsChange', map.getBounds());
				});
				geo.focusCurrentLocation();
			}
		};
	}
]);