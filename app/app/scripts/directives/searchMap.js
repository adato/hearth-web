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
	'$rootScope', '$timeout', 'geo', '$location', 'Post',
	function($rootScope, $timeout, geo, $location, Post) {
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

				scope.getMapBoundingBoxParams = function() {
					return {
						'bounding_box[top_left][lat]': 85,
						'bounding_box[top_left][lon]': -170,
						'bounding_box[bottom_right][lat]': -85,
						'bounding_box[bottom_right][lon]': 175,
						offset: 0
					};
				};

				scope.setSearchParams = function(params) {
					params = angular.extend(scope.getFilterParams(), params);
					$location.search(params);
					$rootScope.$broadcast("filterApplied", params);
				};

				scope.getSearchParams = function() {
					var searchParams = scope.getFilterParams();

					if (typeof searchParams.distance === 'undefined') {
						searchParams = angular.extend(searchParams, scope.getMapBoundingBoxParams());
					}

					searchParams.map_output = 1;
					return searchParams;
				};

				scope.search = function(location) {
					// if we should set new location, set it also to search
					location && location.lon && scope.setSearchParams(location);

					// search only when map is shown
					var params = scope.getSearchParams();

					if (params.lon && params.lat) {
						scope.center = true;
					}

					if (params.name) {
						$(input).val(params.name);
					}

					Post.mapQuery(params, function(data) {
						scope.$broadcast('showMarkersOnMap', data);
					});
				};

				scope.search();
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
