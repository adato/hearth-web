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
	'geo', '$interpolate', '$templateCache', 'Post', '$location', '$timeout', '$rootScope',

	function(geo, $interpolate, $templateCache, Post, $location, $timeout, $rootScope) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				ads: "=",
				center: "=",
				centerTo: "=",
			},
			// transclude: true,
			link: function(scope, element) {
				var markerCluster, oms, map,
					retainCurrentCollectionFlag,
					I_ID = 0,
					I_TYPE = 1,
					I_LOCATION = 2,
					infoWindow = new google.maps.InfoWindow(),
					template = "",
					templateSource = $templateCache.get('templates/geo/markerTooltip.html'),
					markerClusterMaxZoom = 12,
					markers = [],
					markerLimitActive = true,
					markerLimit = 20,
					markerLimitValues = {},
					markerClusterStyles = [{
						url: "images/marker/circle.png",
						textColor: "white",
						width: 27,
						height: 27,
					}, {
						url: "images/marker/circle.png",
						textColor: "white",
						width: 27,
						height: 27,
					}, {
						url: "images/marker/circle2.png",
						textColor: "white",
						width: 34,
						height: 34,
					}, {
						url: "images/marker/circle3.png",
						textColor: "white",
						width: 40,
						height: 40,
					}, {
						url: "images/marker/circle3.png",
						textColor: "white",
						width: 40,
						height: 40,
					}];

				var idleListenerFunction = function() {
					console.log('searching idle searchreq', map.getBounds().toJSON());
					$rootScope.$emit('searchRequest', map.getBounds().toJSON());
				}

				if (typeof templateSource !== 'string') {
					templateSource = templateSource[1];
				}

				template = $interpolate(templateSource);

				scope.initMap = function() {
					console.log('init map');
					if (!map) {
						$timeout(function() {
							map = geo.createMap(element[0], {
								zoom: 11
							});

							google.maps.event.trigger(map, "resize");
							geo.focusCurrentLocation(map);

							oms = new OverlappingMarkerSpiderfier(map, {
								markersWontMove: true,
								markersWontHide: true,
								keepSpiderfied: true,
							});

							markerCluster = new MarkerClusterer(map, [], {
								ignoreHidden: true,
								maxZoom: markerClusterMaxZoom,
								zoomOnClick: true,
								gridSize: 40,
								averageCenter: true,
								styles: markerClusterStyles
							});

							//                            markerCluster.addListener('click', scope.zoomMarkerClusterer);
							oms.addListener('click', scope.onMarkerClick);

							google.maps.event.addListener(map, 'idle', idleListenerFunction);

							/**
							 *	Attach listener to idle state to refresh data.
							 *	I am not using bounds_changed event, as it is buggy and fires multiple times per map drag.
							 */

						}, 100);
					}
				};

				scope.testPositionLimit = function(loc) {
					var lat = parseFloat(loc[0]).toFixed(4);
					var lng = parseFloat(loc[1]).toFixed(4);
					var key = "" + lat + ":" + lng;

					markerLimitValues[key] = markerLimitValues[key] ? markerLimitValues[key] + 1 : 1;
					return markerLimitValues[key] > markerLimit;
				};

				scope.placeMarker = function(location, ad) {
					var marker = geo.placeMarker(geo.getLocationFromCoords(location), ad[I_TYPE] == 0 ? 'need' : 'offer', ad);
					oms.addMarker(marker);
					markers.push(marker);
				};

				scope.showMarkerWindow = function(content, marker) {
					var width = $(".gm-style").css("width");

					infoWindow.setOptions({
						maxWidth: (parseInt(width) - 200)
					});

					infoWindow.setContent(content);
					infoWindow.open(map, marker);

					$('.marker-tooltip').click(function() {
						var itemId = $(this).attr('itemid');

						scope.$apply(function() {
							var path = $location.path('post/' + itemId);
						});
					});
				};

				var extendBounds = function(markers) {
					var bounds = new google.maps.LatLngBounds();
					markers.forEach(function(marker) {
						bounds.extend(marker.getPosition());
					});

					console.log('reduced bounds', bounds)
					return bounds;
				}

				// this will zoom to show all markers and center map view
				scope.centerZoomToAll = function(markers) {
					console.log('centerzoomall', markers);

					google.maps.event.clearListeners(map, 'idle');

					map.fitBounds(extendBounds(markers));

					$timeout(function() {
						console.log('re-set listener');
						google.maps.event.addListener(map, 'idle', idleListenerFunction);
					}, 100);
				};

				scope.onMarkerClick = function(marker) {

					Post.get({
						postId: marker.info[I_ID]
					}, function(data) {
						data.author.avatar.normal = data.author.avatar.normal || $$config.defaultUserAvatar;
						map.panTo(marker.position);
						retainCurrentCollectionFlag = true;

						if (data.author._type == 'Community') {
							data.adType = (data.type === 'need' ? 'WE_NEED' : 'WE_OFFER');
						} else {
							data.adType = data.type;
						}
						scope.showMarkerWindow(template(data), marker);
					}, function(err) {});
				};

				scope.isInDistance = function(maxDist, base, point) {
					var dist = google.maps.geometry.spherical.computeDistanceBetween(
						new google.maps.LatLng(base.lat, base.lng), geo.getLocationFromCoords(point)
					);

					return maxDist > dist / 1000; // transfer to km
				}

				scope.createPins = function(e, ads) {
					console.log('creating pins', ads)
					var i, j, ad, location, distanceBase, distance = false;
					ads = ads || [];
					markers = [];
					markerLimitValues = [];

					if (!retainCurrentCollectionFlag) {
						markerCluster.clearMarkers();
						oms.clearMarkers();
					} else {
						// console.log('setting to false');
						retainCurrentCollectionFlag = false;
					}

					if (typeof $location.search().distance != 'undefined') {
						distance = parseInt($location.search().distance, 10);
						distanceBase = {
							lat: $location.search().lat,
							lng: $location.search().lon
						};
					}

					for (i = 0; i < ads.length; i++) {
						ad = ads[i];

						for (j = 0; j < ad[I_LOCATION].length; j++) {
							if (ad[I_LOCATION][j]) {
								if (
									(distance && !scope.isInDistance(distance, distanceBase, ad[I_LOCATION][j])) ||
									markerLimit && scope.testPositionLimit(ad[I_LOCATION][j])
								) {
									continue;
								}
								scope.placeMarker(ad[I_LOCATION][j], ad);
							}
						}
					}
					console.log('reinit occured, center =', scope.center)

					if (scope.center) scope.centerZoomToAll(markers);
					markerCluster.addMarkers(markers);
					markerCluster.repaint();
				};

				/*                scope.zoomMarkerClusterer = function(cluster) {
				                    map.fitBounds(cluster.getBounds());
				                    map.setZoom(markerClusterMaxZoom + 1);
				                };*/

				scope.initMap();
				scope.$on('showMarkersOnMap', scope.createPins);

				scope.$watch('centerTo', function(newVal, oldVal) {
					if (newVal !== oldVal && newVal !== null) {

						google.maps.event.clearListeners(map, 'idle');

						if (typeof newVal.lng === 'undefined') {
							newVal.lng = newVal.lon;
						}
						map.setCenter(newVal);
						map.setZoom(markerClusterMaxZoom + 1);
						console.log('centerTo applied');



						$rootScope.$emit('searchRequest', map.getBounds().toJSON());

						$timeout(function() {
							console.log('re-set listener2');
							google.maps.event.addListener(map, 'idle', idleListenerFunction);
						}, 100);

					}
				});
			}
		};
	}
]);