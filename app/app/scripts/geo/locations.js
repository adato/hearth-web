'use strict';

/**
 * @ngdoc directive
 * @name hearth.geo.locations
 * @description Renders fields for selecting location, and allows to select location.
 * @restrict E
 *
 * @requires $timeout
 * @requires geo
 */
angular.module('hearth.geo').directive('locations', [
    'geo', '$timeout',
    function(geo, $timeout) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                locations: '=',
                limit: '=',
                error: '=',
                errorMessage: '=',
                hideMap: '='
            },
            templateUrl: 'templates/geo/locations.html',
            link: function(scope, baseElement) {
                var map, marker;
                scope.mapDisplay = -1;
                scope.error = false;
                scope.errorMsg = scope.errorMessage || 'LOCATIONS_IS_EMPTY';

                function getDefaultLocation() {

                    return angular.copy({
                        type: 'Point',
                        name: '',
                        coordinates: null
                    });
                }

                function placeMarker(position, map) {
                    if (marker) {
                        marker.setMap(null);
                    }
                    marker = geo.placeMarker(position, 'pin', null, map);
                    map.panTo(position);
                };

                function initSearchBoxes() {
                    console.log("init");
                    $('.map-input', baseElement).each(function(index) {
                        if ($(this).hasClass("inited")) {
                            return true;
                        }
                        $(this).addClass("inited");

                        var sBox = new google.maps.places.SearchBox(this);
                        google.maps.event.addListener(sBox, 'places_changed', function() {
                            var places = sBox.getPlaces();
                            if (places && places.length) {
                                var location = places[0].geometry.location,
                                    name = places[0].formatted_address,
                                    info = scope.translateLocation(places[0].address_components);

                                scope.fillLocation(index, places[0].geometry.location, name, info);
                            }
                        });

                        $(this).keyup(function() {
                            if (!this.value) {
                                scope.clearLocation(index);
                            }
                        });

                        $(this).blur(function() {
                            if (!this.value) {
                                scope.clearLocation(index);
                            }
                        });
                    });
                };

                scope.hideError = function(loc) {

                    if (loc && loc.name == '') {
                        scope.error = false;
                    }
                };

                scope.testEmptyLocation = function(item) {

                    item.name === '' && (scope.error = true);
                };

                scope.testAllEmptyLocation = function () {


                    scope.locations.forEach(function (item) {
                        scope.testEmptyLocation(item);
                    });
                };

                scope.translateLocation = function(loc) {
                    var short = {},
                        long = {};

                    if (loc) {
                        Object.keys(loc).forEach(function(key) {
                            short[loc[key].types[0]] = loc[key].short_name;
                            long[loc[key].types[0]] = loc[key].long_name;
                        });
                    }

                    return {
                        street_number: long.street_number, // cislo baraku
                        street_premise: long.premise, // cislo popisne
                        street: long.route, // ulice
                        country: long.country, // zeme
                        country_code: short.country, // kod zeme - CZ
                        zipcode: long.postal_code, // PSC
                        city: long.postal_town || long.locality || long.administrative_area_level_1, // mestska cast nebo jen mesto nebo kraj
                        area: long.administrative_area_level_1, // kraj
                    };
                };

                scope.clearLocation = function(index) {
                    scope.locations[index] = getDefaultLocation();
                    scope.$apply();
                };

                scope.fillLocation = function(index, pos, addr, info) {
                    scope.locations[index] = {
                        name: addr,
                        coordinates: [pos.lng(), pos.lat()]
                    };

                    if ($.isPlainObject(info)) {
                        Object.keys(info).forEach(function(key) {
                            scope.locations[index][key] = info[key];
                        });
                    }
                    scope.$apply();
                };

                scope.closeMap = function() {
                    scope.toggleMap(-1);
                };

                scope.initMap = function(index) {

                    map = geo.createMap($("#map-" + index, baseElement)[0], {
                        draggableCursor: 'url(images/pin.png) 14 34, default'
                    });

                    google.maps.event.addListener(map, 'click', function(e) {
                        placeMarker(e.latLng, map);
                        geo.getAddress(e.latLng).then(function(info) {

                            scope.fillLocation(index, e.latLng, info.formatted_address, scope.translateLocation(info.address_components));
                            scope.closeMap();
                        });
                    });
                };

                scope.remove = function($event, $index) {
                    if ($event)
                        $event.preventDefault();

                    scope.hideError(scope.locations[$index]);
                    scope.locations.splice($index, 1);

                    if (scope.mapDisplay == $index)
                        scope.closeMap();

                    scope.testAllEmptyLocation();
                };

                scope.removeAll = function() {

                    for (var len = scope.locations.length - 1; len + 1; len--) {
                        scope.remove(null, len);
                    }
                }

                scope.add = function() {
                    scope.locations.push(getDefaultLocation());
                    scope.error = false;
                    setTimeout(initSearchBoxes);
                };

                scope.toggleMap = function(index) {
                    var actual = angular.copy(scope.mapDisplay);

                    if (scope.limit == true) {
                        return false;
                    }

                    if (scope.mapDisplay != -1) {
                        $("#map-" + scope.mapDisplay, baseElement).fadeToggle();
                        scope.mapDisplay = -1;
                    }

                    if (actual != index && index != -1) {
                        $("#map-" + index, baseElement).fadeToggle();
                        scope.mapDisplay = index;
                        scope.initMap(index);
                    }
                };

                scope.locationDoesNotMatter = function() {
                    scope.closeMap();
                    // scope.limit = !scope.limit;

                    if (scope.limit != true) {
                        scope.removeAll();
                        scope.add();
                    }
                }

                scope.$watch('locations', initSearchBoxes);
                setTimeout(initSearchBoxes);
            }
        };
    }
]);