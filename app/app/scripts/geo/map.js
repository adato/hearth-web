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
	'geo', '$interpolate', '$templateCache', 'Post', '$location', '$route',

	function(geo, $interpolate, $templateCache, Post, $location, $route) {
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
					markers = [],
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
					}],
					//init clusterer with your options				var mc = new MarkerClusterer(map, markers, mcOptions);
					markerCluster = new MarkerClusterer(map, markers, {
						ignoreHidden: true,
						maxZoom: 14,
						size: 20,
						styles: markerClusterStyles
					}),
					placeMarker = function(location, ad) {
						var marker = geo.placeMarker(geo.getLocationFromCoords(location), ad.type, ad);

						oms.addMarker(marker);
						markers.push(marker);
					},
					showMarkerWindow = function(content, marker) {
						var width = $(".gm-style").css("width");

						infoWindow.setOptions({maxWidth: (parseInt(width) - 200) });
						infoWindow.setContent(content);
						infoWindow.open(map, marker);

						$('.marker-tooltip').click(function() {
							var itemId = $(this).attr('itemid');

							scope.$apply(function() {
								var path = $location.path('ad/' + itemId);
							});
						});
					},
					onMarkerClick = function(marker) {

						Post.get({
							postId: marker.info._id
						}, function(data) {

							data.author.avatar.normal = data.author.avatar.normal || EMPTY_AVATAR_URL;
							map.setCenter(marker.position);

							
							if (data.community_id) {
								data.adType = data.type === 'need' ? 'WE_NEED' : 'WE_GIVE';
							} else {
								data.adType = data.type;
							}
							showMarkerWindow(template(data), marker);

						}, function(err) {});
					},
					createPins = function(e, ads) {
						var i, j, ad, location;
						ads = ads || [];

						console.log("Nacitam.." + ads.length);
						for (i = 0; i < ads.length; i++) {
							ad = ads[i];

							for (j = 0; j < ad.locations.length; j++) {
								if (ad.locations[j])
									placeMarker(ad.locations[j], ad);
							}
						}

						markerCluster.addMarkers(markers);
						markerCluster.repaint();
					},
					hideMarkers = function() {
						for (var i = 0; i < markers.length; i++) {
							markers[i].setVisible(false);
						}
					};

				oms.addListener('click', onMarkerClick);
				scope.$on('keywordSearch', hideMarkers);
				scope.$on('searchByLoc', createPins);

				geo.focusCurrentLocation();
			}
		};
	}
]);