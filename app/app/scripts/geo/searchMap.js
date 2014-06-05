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
	'$timeout', 'geo',

	function($timeout, geo) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				location: '=',
				setLocationFn: '&',
				items: '='
			},
			templateUrl: 'templates/geo/searchMap.html',
			link: function(scope, element) {
				var searchBoxElement = $('input', element),
					searchBox = new google.maps.places.SearchBox(searchBoxElement[0]);

				google.maps.event.addListener(searchBox, 'places_changed', function() {
					var places = searchBox.getPlaces();

					if (places && places.length > 0) {
						geo.focusLocation(places[0].geometry.location);
						scope.search(places[0].geometry.location);
					}
				});

				scope.autodetectMyLocation = function() {
					geo.getCurrentLocation().then(function(location) {
						geo.focusLocation(location);
						geo.getAddress(location).then(function(address) {
							searchBoxElement.val(address);
						});
						scope.search(location);
					});
				};

				scope.search = function(location) {
					scope.setLocationFn({
						location: location
					});
				};
				scope.autodetectMyLocation();
			}
		};
	}
]);