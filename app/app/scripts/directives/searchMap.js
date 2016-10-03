'use strict';
/**

 * @ngdoc directive
 * @name hearth.geo.searchMap
 * @description UI for search box with map
 *
 * @restrict E
 * @requires $timeout
 * @requires geo
 */

angular.module('hearth.geo').directive('searchMap', [
	'$timeout', 'geo', '$location', 'Post', '$rootScope',
	function($timeout, geo, $location, Post, $rootScope) {
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			templateUrl: 'templates/directives/searchMap.html',
			link: function(scope, element) {
				scope.center = false;
				scope.centerTo = null;
				var input = $('input', element)[0];
				var options = {
					types: ['geocode']
				};
				var autocomplete = new google.maps.places.Autocomplete(input, options);
				google.maps.event.addListener(autocomplete, 'place_changed', function() {
					scope.googleAutocomplete();
				});


				scope.googleAutocomplete = function() {
					var place = autocomplete.getPlace();

					if (typeof place === "undefined" || !place.address_components) {
						$(input).val('');
						return false;
					}

					if (place && place.address_components) {
						var location = place.geometry.location;
						var dist = $location.search().distance;

						scope.centerTo = {
							lat: location.lat(),
							lon: location.lng(),
						};
						scope.setSearchParams(scope.centerTo);
					}
				}

				scope.autodetectMyLocation = function() {
					var dist = $location.search().distance;
					geo.getCurrentLocation().then(function(location) {
						geo.focusLocation(location);
						geo.getAddress(location).then(function(info) {
							$(input).val(info.formatted_address);
							scope.centerTo = {
								lat: location.lat(),
								lon: location.lng(),
							};
						});
					});
				};

				/**
				 *	@param boundingBox {LatLngBoundsLiteral} [optional]
				 *	https://developers.google.com/maps/documentation/javascript/reference#LatLngBoundsLiteral
				 */
				scope.getMapBoundingBoxParams = function(boundingBox) {
					boundingBox = boundingBox || {};
					return {
						'bounding_box[top_left][lat]': boundingBox.north || 85,
						'bounding_box[top_left][lon]': boundingBox.west || -170,
						'bounding_box[bottom_right][lat]': boundingBox.south || -85,
						'bounding_box[bottom_right][lon]': boundingBox.east || 175,
						offset: 0
					};
				};

				// transforms url params (?lat&lng&...) into js object
				scope.getUrlParams = function() {
					return angular.copy($location.search());
				};

				// propagates changes from js object into url
				scope.setSearchParams = function(params) {
					params = angular.extend(scope.getUrlParams(), params);
					$location.search(params);

					//$rootScope.$broadcast("filterApplied", params);
				};


				scope.search = function(boundingBox) {
					scope.center = false;
					var searchParams = scope.getUrlParams();
					searchParams.map_output = 1;

					if (typeof boundingBox !== 'undefined') {
						searchParams = angular.extend(searchParams, scope.getMapBoundingBoxParams(boundingBox));
						scope.setSearchParams(searchParams);
					}

					if (typeof boundingBox === 'undefined' || (typeof searchParams.name !== 'undefined' && searchParams.name == '')) {
						scope.center = true;
					}

					Post.mapQuery(searchParams, function(data) {
						scope.$broadcast('showMarkersOnMap', data);
					});
				};

				var len = scope.getUrlParams().name;
				if (typeof len === 'undefined') {
					scope.autodetectMyLocation();
				} else {
					scope.search();
				}

				/**
				 *	Event handler for map searches.
				 *	scope.search takes one param - loc {Object}
				 */
				var lastBoundingBoxUsed;
				$rootScope.$on('searchRequest', function(event, boundingBox) {
					if (typeof lastBoundingBoxUsed !== 'undefined' && lastBoundingBoxUsed.south == boundingBox.south && lastBoundingBoxUsed.west === boundingBox.west && lastBoundingBoxUsed.east === boundingBox.east && lastBoundingBoxUsed.north === boundingBox.north) {} else {
						scope.search(boundingBox);
					}
					lastBoundingBoxUsed = boundingBox;

				});

				scope.$on('filterReseted', function() {
					scope.search();
				});
				scope.$on('filterApplied', function() {
					scope.search();
				});

				scope.$on('$destroy', function() {
					input = null;
					autocomplete = null;
				});
			}
		};
	}
]);