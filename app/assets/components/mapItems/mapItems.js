'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.mapItems
 * @description This will show given locations to map and center viewport on all of them
 * @restrict E
 */

angular.module('hearth.directives').directive('mapItems', [
	'geo', '$timeout',
	function(geo, $timeout) {
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
				var markerImage = {
					url: $$config.imgUrl + '/pin.png',
					size: new google.maps.Size(49, 49),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(14, 34)
				};
				var options = {};
				options.scrollwheel = ($scope.zoomOnScroll !== undefined ? $scope.zoomOnScroll : false);

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

					// add location markers into the map
					$scope.items.forEach(function(item) {
						var lat = item.coordinates[1];
						var lng = item.coordinates[0];
						var latLng = new google.maps.LatLng(lat, lng);
						var marker = new google.maps.Marker({
							map: map,
							draggable: false,
							animation: google.maps.Animation.DROP,
							position: latLng,
							icon: markerImage
						});

						markers.push(marker);
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