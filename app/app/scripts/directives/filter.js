'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.filter
 * @description Filter rules for search
 * @restrict E
 */
angular.module('hearth.directives').directive('filter', [
	'geo',

	function(geo) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				filter: '=data'
			},
			templateUrl: 'templates/directives/filter.html',
			link: function(scope, element) {
				var searchBoxElement = $('input#geolocation', element),
					searchBox = new google.maps.places.SearchBox(searchBoxElement[0]),
					defaultFilter = {
						type: '',
						distance: 25
					};

				scope.expanded = false;
				scope.search = function() {
					var filterData = angular.copy(scope.filter),
						keywords = $.map(filterData.keywords || [], function(item) {
							return item.text;
						});

					if (keywords.length > 0) {
						filterData.keywords = keywords.join(',');
					} else {
						delete filterData.keywords;
					}

					scope.$emit('filter', filterData);
					scope.close();
				};
				scope.close = function() {
					scope.$emit('closeFilter');
				};

				scope.reset = function() {
					scope.filter = angular.copy(defaultFilter);
					scope.$emit('clearFilter');
					scope.close();
				};

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

				scope.reset();

			}
		};
	}
]);