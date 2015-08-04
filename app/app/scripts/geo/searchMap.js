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
            },
            templateUrl: 'templates/geo/searchMap.html',
            link: function(scope, element) {
                scope.center = false;
                var searchBoxElement = $('input', element),
                    searchBox = new google.maps.places.SearchBox(searchBoxElement[0]);

                google.maps.event.addListener(searchBox, 'places_changed', function() {
                    var places = searchBox.getPlaces();
                    if (places && places.length > 0) {
                        geo.focusLocation(places[0].geometry.location);
                        
                        var loc = places[0].geometry.location;
                        scope.search({lat: loc.lat(), lon: loc.lng(), distance: '50km', name: places[0].formatted_address});
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
                };

                scope.getSearchParams = function() {
                    var searchParams = scope.getFilterParams();

                    if (typeof searchParams.distance === 'undefined') {
						searchParams = angular.extend(searchParams, scope.getMapBoundingBoxParams());
                    }

                    searchParams.map_output = 1;
                    return searchParams;
                };

                scope.search = function(loc) {
                    // if we should set new location, set it also to search
                    loc && loc.lon && scope.setSearchParams(loc);

                    // search only when map is shown
                    var params = scope.getSearchParams();

                    if(params.lon)
                        scope.center = true;

                    Post.mapQuery(params, function(data) {
                        scope.$broadcast('showMarkersOnMap', data);
                    });
                };

                scope.search();
                scope.autodetectMyLocation();
                scope.$on('filterReseted', scope.search);
                scope.$on('filterApplied', scope.search);

                scope.$on('$destroy', function () {
                    scope.searchBoxElement = null;
                    scope.searchBox = null;
                });
            }
        };
    }
]);