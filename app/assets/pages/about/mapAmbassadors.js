'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.mapAmbassadors
 * @description This will show ambassadors (from service) on a map
 * @restrict E
 */

angular.module('hearth.directives').directive('mapAmbassadors', [
	'geo', '$timeout', '$location', '$window',
	function(geo, $timeout, $location, $window) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				'items': '=',
				'zoomOnScroll': '='
			},
			template: '<div class="map-container"></div>',
			link: function($scope, baseElement, attrs) {
				var map, markers = [];
				var options = {};
				options.scrollwheel = ($scope.zoomOnScroll !== undefined ? $scope.zoomOnScroll : false);
				var oms;

				/**
				 * Is map inited - will return boolean
				 */
				$scope.isInited = function() {
					return $(".map-container", baseElement).hasClass("inited");
				};

				/**
				 * This will init the map but only once
				 */
				$scope.initMap = function() {
					if ($scope.isInited())
						return false;
					map = geo.createMap($(".map-container")[0], options);
					map.setOptions({
						scrollwheel: false
					});

					oms = new OverlappingMarkerSpiderfier(map, {
						markersWontMove: true,
						markersWontHide: true,
						keepSpiderfied: true,
					});

					$(".map-container", baseElement).addClass("inited");
				};

				/**
				 * This will clear all map markers
				 */
				$scope.clearMap = function() {
					markers.forEach(function(item) {
						item.setMap(null);
					});
					markers = [];
				};

				/**
				 * Zoom out at all markers in the map
				 */
				$scope.fitZoom = function() {
					var bounds = new google.maps.LatLngBounds();

					// add markers to bound
					markers.forEach(function(item) {
						bounds.extend(item.getPosition());
					});

					// fit markers to bound
					map.fitBounds(bounds);

					// don't zoom so close when in map is only one marker
					var listener = google.maps.event.addListener(map, "idle", function() {
						if (map.getZoom() > 16) map.setZoom(16);
						google.maps.event.removeListener(listener);
					});
				};

				/**
				 * Refresh locations - show them in map
				 */
				$scope.refreshMarkers = function() {
					$scope.initMap();
					$scope.clearMap();

					// if there are no locations, dont continue
					if (!$scope.items.length) {
						return false;
					}
					var infowindow = null;

					// reset OMS markers
					oms.clearMarkers();

					// add location markers into the map
					$scope.items.forEach(function(item) {
						var lat = item.geo[1];
						var lng = item.geo[0];
						var latLng = new google.maps.LatLng(lat, lng);
						var marker = new google.maps.Marker({
							map: map,
							draggable: false,
							position: latLng,
							icon: {
								url: $$config.imgUrl + '/pin.png',
								size: new google.maps.Size(49, 49),
								origin: new google.maps.Point(0, 0),
								anchor: new google.maps.Point(14, 34)
							}
						});

						// add marker to OMS and markers array
						oms.addMarker(marker);
						markers.push(marker);

						var markerClickFn = function() {
							if (infowindow) infowindow.close(); 

							var href = $window.$$config.basePath + $location.path() + '#' + item._id;
							infowindow = new google.maps.InfoWindow({
								content: 
									'<div style="display:block; width:300px">' + 
									'<h3><a href="' + href + '">' + item.name + '</a></h3>' + 
									'<hr size="1"/>' + 
									'<p class="pull-right">' + item.area + '</p>' + 
									'<a href="' + href + '" class="pull-left"><img src="' + item.avatar.normal + '" class="avatar small"></a>' +
									'</div>'
							});
							infowindow.open(map, marker);
						}

						oms.addListener('click', markerClickFn);
						marker.addListener('click', markerClickFn);
					});

					// center map viewport at all markers
					$scope.fitZoom();
				};

				// when locations array is changed,
				$scope.$watch("items", function(val) {
					$timeout($scope.refreshMarkers, 200);
				});

			}
		};
	}
]);