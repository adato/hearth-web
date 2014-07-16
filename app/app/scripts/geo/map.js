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
	'geo', '$interpolate', '$templateCache', 'Post', '$location', '$route', '$rootScope',

	function(geo, $interpolate, $templateCache, Post, $location, $route, $rootScope) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				items: "="
			},
			transclude: true,
			link: function(scope, element) {
				var markerCluster,
					oms,
					self = {},
					infoWindow = new google.maps.InfoWindow(),
					template = $interpolate($templateCache.get('templates/geo/markerTooltip.html')[1]),
					map = geo.createMap(element[0], {
						zoom: 11
					}),
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

				self.initMap = function() {

					alert("INIT MAP");
					geo.focusCurrentLocation();

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


					markerCluster.addListener('click', self.zoomMarkerClusterer);
					oms.addListener('click', self.onMarkerClick);
				};

				self.testPositionLimit = function(loc) {

					var lat = parseFloat(loc[0]).toFixed(4),
						lng = parseFloat(loc[1]).toFixed(4),
						key = "" + lat + ":" + lng;

					if (markerLimitValues[key])
						markerLimitValues[key]++;
					else
						markerLimitValues[key] = 1;

					return markerLimitValues[key] > markerLimit;
				};

				self.placeMarker = function(location, ad) {
					var marker = geo.placeMarker(geo.getLocationFromCoords(location), ad.type, ad);

					oms.addMarker(marker);
					markers.push(marker);
				};

				self.showMarkerWindow = function(content, marker) {
					var width = $(".gm-style").css("width");

					infoWindow.setOptions({
						maxWidth: (parseInt(width) - 200)
					});

					content = '<div style="min-height: 100px; min-width: 200px;">' + content + '</div>';
					infoWindow.setContent(content);
					infoWindow.open(map, marker);

					$('.marker-tooltip').click(function() {
						var itemId = $(this).attr('itemid');

						scope.$apply(function() {
							var path = $location.path('ad/' + itemId);
						});
					});
				};

				self.onMarkerClick = function(marker) {

					Post.get({
						postId: marker.info._id
					}, function(data) {

						data.author.avatar.normal = data.author.avatar.normal || EMPTY_AVATAR_URL;
						map.panTo(marker.position);

						if (data.community_id) {
							data.adType = data.type === 'need' ? 'WE_NEED' : 'WE_GIVE';
						} else {
							data.adType = data.type;
						}

						showMarkerWindow(template(data), marker);

					}, function(err) {});
				};

				self.createPins = function(ads) {
					var i, j, ad, location;
					ads = ads || [];
					markers = [];

					markerCluster.clearMarkers();
					oms.clearMarkers();
					
					console.dir(ads);

					console.log("Nacitam.." + ads.length);
					return;


					for (i = 0; i < ads.length; i++) {
						ad = ads[i];

						for (j = 0; j < ad.locations.length; j++) {
							if (ad.locations[j]) {

								if (markerLimit && testPositionLimit(ad.locations[j]))
									continue;

								placeMarker(ad.locations[j], ad);
							}
						}
					}

					markerCluster.addMarkers(markers);
					markerCluster.repaint();
				};

				self.zoomMarkerClusterer = function(cluster) {

					map.fitBounds(cluster.getBounds());
					map.setZoom(markerClusterMaxZoom + 1);
				};

				$rootScope.$on('searchMap', self.initMap);
				scope.$watch('items', self.createPins);
				// scope.$watch('showMapPins', createPins);
			}
		};
	}
]);