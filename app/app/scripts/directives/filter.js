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
						distance: 25,
						related: []
					};

				scope.expanded = false;

				scope.search = function() {
					var item, key,
						filterData = angular.copy(scope.filter);

					filterData.keywords = $.map(filterData.keywords || [], function(item) {
						return item.text;
					});
					if (!filterData.lon || !filterData.lon) {
						delete filterData.distance;
					}
					for (key in filterData) {
						item = filterData[key];
						filterData[key] = $.isArray(item) ? item.join(',') : item;

						if (!filterData[key]) {
							delete filterData[key];
						}
					}
					if ($.isEmptyObject(filterData)) {
						scope.reset();
					} else {
						scope.$emit('filter', filterData);
						scope.close();
					}
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
						var location = places[0].geometry.location,
							name = places[0].name;

						scope.$apply(function() {
							scope.filter.name = name;
							scope.filter.lat = location.lat();
							scope.filter.lon = location.lng();
						});
					}
				});

				scope.$watch('place', function(value) {
					if (!value) {
						delete scope.filter.lat;
						delete scope.filter.lon;
						delete scope.filter.name;
					}
				});

				scope.reset();

			}
		};
	}
]);