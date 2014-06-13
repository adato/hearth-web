'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.filter
 * @description Filter rules for search
 * @restrict E
 */
angular.module('hearth.directives').directive('filter',
	function(geo) {
		return {
			restrict: 'E',
			scope: {
				filter: '=data',
				searchFn: '&'
			},
			templateUrl: 'templates/filter.html',
			link: function(scope, element) {
				var searchBoxElement = $('input#geolocation', element),
					searchBox = new google.maps.places.SearchBox(searchBoxElement[0]);

				google.maps.event.addListener(searchBox, 'places_changed', function() {
					var places = searchBox.getPlaces();

					if (places && places.length > 0) {
						var location = places[0].geometry.location;

						scope.$apply(function() {
							scope.filter.lat = location.lat();
							scope.filter.lon = location.lng();
						});
					}
				});

			}
		};
	}
);