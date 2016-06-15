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
			scope: {
				location: '=',
				setLocationFn: '&',
				setLoadingFn: '&',
				items: '=',
			},
			templateUrl: 'templates/directives/searchMap.html',
			link: function(scope, element) {
				scope.center = false;
				var input = $('input', element)[0];
				var options = {
					types: ['address']
				};
				var autocomplete = new google.maps.places.Autocomplete(input, options);

				google.maps.event.addListener(autocomplete, 'place_changed', function() {
					var place = autocomplete.getPlace();

					if (typeof place === "undefined" || !place.address_components) {
						$(input).val('');
						return false;
					}

					if (place && place.address_components) {
						var location = place.geometry.location;
						var dist = $location.search().distance;

						scope.search({
							lat: location.lat(),
							lon: location.lng(),
							distance: dist ? dist : '50km',
							name: place.formatted_address
						});

						geo.focusLocation(location);
					}
				});

				scope.autodetectMyLocation = function() {
					geo.getCurrentLocation().then(function(location) {
						geo.focusLocation(location);
						geo.getAddress(location).then(function(info) {
							$(input).val(info.formatted_address);
						});
						// search is ran separately and for the whole map so no need to run it here again
						// scope.search(location);
					});
				};

				scope.getFilterParams = function() {
					return angular.copy($location.search());
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

				scope.setSearchParams = function(params) {
					params = angular.extend(scope.getFilterParams(), params);
					$location.search(params);
					$rootScope.$broadcast("filterApplied", params);
				};

				scope.getSearchParams = function(boundingBox) {
					var searchParams = scope.getFilterParams();

					if (typeof searchParams.distance === 'undefined') {
						searchParams = angular.extend(searchParams, scope.getMapBoundingBoxParams(boundingBox));
					}

					searchParams.map_output = 1;
					return searchParams;
				};

				scope.search = function(loc, boundingBox) {
					// if we should set new location, set it also to (url) search
					loc && loc.lon && scope.setSearchParams(loc);

					// search only when map is shown
					console.log(boundingBox);
					var params = scope.getSearchParams(boundingBox);

					if (params.lon) scope.center = true;

					Post.mapQuery(params, function(data) {
						console.log(data);
						scope.$broadcast('showMarkersOnMap', data);
					});
				};

				/**
				 *	Event handler for map searches.
				 *	scope.search takes one param - loc {Object}
				 */
				$rootScope.$on('searchRequest', function(event, boundingBox) {
					scope.search(false, boundingBox);
				});

				// scope.search();
				scope.autodetectMyLocation();
				scope.$on('filterReseted', scope.search);
				scope.$on('filterApplied', scope.search);

				scope.$on('$destroy', function() {
					input = null;
					autocomplete = null;
				});
			}
		};
	}
]);
