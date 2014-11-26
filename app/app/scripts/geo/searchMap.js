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
    '$timeout', 'geo', '$location', 'Post',

    function($timeout, geo, $location, Post) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                location: '=',
                setLocationFn: '&',
                setLoadingFn: '&',
                items: '=',
                showMap: '='
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
                        geo.getAddress(location).then(function(info) {
                            searchBoxElement.val(info.formatted_address);
                        });
                        scope.search(location);
                    });
                };

                scope.search = function(location) {
                    scope.setLocationFn({
                        location: location
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

                scope.getSearchParams = function() {
                    var searchParams = scope.getFilterParams();

                    if (typeof searchParams.distance === 'undefined') {
						searchParams = angular.extend(searchParams, scope.getMapBoundingBoxParams());
                    }

                    searchParams.map_output = 1;
                    return searchParams;
                };

                scope.search = function() {

                    // search only when map is shown
                    if (scope.showMap) {
                        Post.mapQuery(scope.getSearchParams(), function(data) {
                            scope.setLoadingFn(true);
                            scope.$broadcast('showMarkersOnMap', data);
                        });
                    }
                };

                scope.$on('initMap', scope.search);
                scope.$on('initMap', scope.autodetectMyLocation);
                scope.$on('filterReseted', scope.search);
                scope.$on('filterApplied', scope.search);
            }
        };
    }
]);