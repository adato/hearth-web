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
                locations: "=",
                required: "="
            },
            templateUrl: 'templates/geo/locations.html',
            link: function($scope, baseElement) {
                var map, markers, sBox, tagsInput;

                $scope.disabled = false;

                // scope.errorMsg = scope.errorMessage || 'LOCATIONS_IS_EMPTY';
                // scope.placeholder = scope.placeholderKey || "MY_PLACE";

                // init google places search box
                function addPlacesAutocompleteListener(input) {

                    var sBox = new google.maps.places.SearchBox(input);
                    google.maps.event.addListener(sBox, 'places_changed', function() {
                        var places = sBox.getPlaces();
                        if (places && places.length) {

                            var location = places[0].geometry.location,
                                name = places[0].formatted_address,
                                info = $scope.translateLocation(places[0].address_components);

                            $scope.fillLocation(location, name, info, true);
                        }
                    });

                    $(input).on('keyup keypress', function(e) {
                      if(e.keyCode == 13) {
                        e.preventDefault();
                        return false;
                      }
                    });


                    $(document).on('focusout', input, function(e) {
                        $timeout(function() {
                            tagsInput.val('');
                        });
                     });

                    return sBox;
                }

                function refreshMarkers() {

                    if(! $(".location-map", baseElement).hasClass("inited"))
                        return false;

                    for(var m in markers) {
                        markers[m].setMap(null);
                    }
                    markers = [];

                    for(var l in $scope.locations) {
                        var latlng = new google.maps.LatLng($scope.locations[l].coordinates[1], $scope.locations[l].coordinates[0]);
                        markers.push(geo.placeMarker(latlng, 'pin', null, map));
                    }
                };

                // scope.hideError = function(loc) {
                //     scope.errorWrongPlace = false;
                    
                //     if (loc && loc.name == '') {
                //         scope.error = false;
                //     }
                // };

                // this will translate info from location to used format
                $scope.translateLocation = function(loc) {
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

                $scope.apply = function() {
                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }
                };

                // go throught all places and compare new location
                $scope.locationExists = function(name) {

                    for(var loc in $scope.locations) {
                        if($scope.locations[loc].name == name)
                            return true;
                    }
                    return false;
                };

                // add location to list
                $scope.fillLocation = function(pos, addr, info, apply) {

                    // but only when it is now added yet
                    if(!$scope.locationExists(addr)) {

                        info.name = addr;
                        info.coordinates = [pos.lng(), pos.lat()];
                        $scope.locations.push(info);

                        if(apply)
                            $scope.apply();
                        // refreshMarkers();
                    }

                    // and erase input for next location
                    tagsInput.val('');
                };

                // slide down
                $scope.showMap = function() {

                    $(".mapIcon .fa-times", baseElement).show();
                    $(".location-map", baseElement).slideDown();
                    $timeout($scope.initMap, 100);
                };

                // slide up 
                $scope.closeMap = function() {
                    $(".location-map", baseElement).slideUp();
                    $(".mapIcon .fa-times", baseElement).hide();
                };

                $scope.initMap = function() {
                    if($(".location-map", baseElement).hasClass("inited"))
                        return false;

                    map = geo.createMap($(".location-map", baseElement)[0], {
                        draggableCursor: 'url(images/pin.png) 14 34, default'
                    });

                    google.maps.event.addListener(map, 'click', function(e) {
                        map.panTo(e.latLng);

                        geo.getAddress(e.latLng).then(function(info) {
                            $scope.fillLocation(e.latLng, info.formatted_address, $scope.translateLocation(info.address_components), false);
                            // $scope.closeMap();
                        });
                    });

                    $(".location-map", baseElement).addClass("inited");
                    refreshMarkers();
                };

                $scope.toggleMap = function() {
                    if($scope.disabled) return false;

                    if($(".location-map", baseElement).is(":visible"))
                        $scope.closeMap();
                    else
                        $scope.showMap();
                };

                $scope.locationDoesNotMatter = function() {
                    $scope.closeMap();
                    $scope.locations = [];
                    // refreshMarkers();

                    if(tagsInput.attr("disabled")  === "disabled")
                        tagsInput.removeAttr("disabled");
                    else
                        tagsInput.attr("disabled", "disabled");
                };

                $scope.init = function() {

                    tagsInput = $(".tags input", baseElement);
                    sBox = addPlacesAutocompleteListener($('.tags input', baseElement)[0]);
                    // $scope.initMap();
                };


                $scope.$watch("locations", function() {
                    console.log("Locations: ", $scope.locations);
                    refreshMarkers();
                }, true);
                $timeout($scope.init);
            }
        };
    }
]);