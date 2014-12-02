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
    'geo', '$timeout', '$rootScope',
    function(geo, $timeout, $rootScope) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                locations: "=",
                required: "=",
                disabled: "=limit",
                showError: "=",
                errorCode: "@"
            },
            templateUrl: 'templates/geo/locations.html',
            link: function($scope, baseElement) {
                var map, sBox, tagsInput, marker = false;
                $scope.mapPoint = false;
                $scope.errorWrongPlace = false;
                if(!$scope.locations)
                    $scope.locations = [];
                if(!$scope.errorCode)
                    $scope.errorCode = 'LOCATIONS_ARE_EMPTY';

                 var markerImage = {
                    url: 'images/pin.png',
                    // This marker is 20 pixels wide by 32 pixels tall.
                    size: new google.maps.Size(49, 49),
                    // The origin for this image is 0,0.
                    origin: new google.maps.Point(0,0),
                    // The anchor for this image is the base of the flagpole at 0,32.
                    anchor: new google.maps.Point(14, 34)
                  };

                // init google places search box
                function addPlacesAutocompleteListener(input) {

                    var sBox = new google.maps.places.SearchBox(input);
                    google.maps.event.addListener(sBox, 'places_changed', function() {
                        var places = sBox.getPlaces();
                        $scope.showError = false;

                        if (places && places.length) {
                            $scope.errorWrongPlace = false;
                            console.log("PL: ", places)
                            var location = places[0].geometry.location,
                                name = places[0].formatted_address,
                                info = $scope.translateLocation(places[0].address_components);

                            $scope.fillLocation(location, name, info, true);
                        } else {
                            $scope.errorWrongPlace = true;
                            $scope.apply();
                        }
                    });

                    $(input).on('keyup keypress', function(e) {
                      if(e.keyCode == 13 && $(input).val() != '') {
                        e.preventDefault();
                        return false;
                      }
                    });

                    $(document).on('focusout', input, function(e) {
                        $timeout(function() {
                            tagsInput.val('');
                        });
                     });

                    $(document).on('focusin', input, function(e) {
                        $scope.errorWrongPlace = false;
                        $scope.apply();
                     });

                    return sBox;
                }

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
                        $scope.$digest();
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

                        tagsInput.focus();


                        if(apply) {
                            console.log("AA");
                            $scope.apply();
                        }
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
                    if(marker) {
                        marker.setMap(null);
                        marker = false;
                    }

                    $scope.mapPoint = false;

                    $(".location-map", baseElement).slideUp();
                    $(".mapIcon .fa-times", baseElement).hide();
                };

                $scope.chooseMapLocation = function() {

                    if(! $scope.mapPoint)
                        return false;
                    
                    $scope.fillLocation($scope.mapPoint.latLng, $scope.mapPoint.name, $scope.mapPoint.info, false);
                    $scope.closeMap();
                };

                $scope.refreshMapPoint = function() {
                    geo.getAddress(marker.getPosition()).then(function(info) {
                            
                        $scope.mapPoint = {
                            latLng: marker.getPosition(),
                            name: info.formatted_address,
                            info: $scope.translateLocation(info.address_components)
                        };
                    });
                };
                
                $scope.initMap = function() {

                    if($(".location-map", baseElement).hasClass("inited"))
                        return false;

                    map = geo.createMap($(".map-container", baseElement)[0], {
                        draggableCursor: 'url(images/pin.png) 14 34, default'
                    });

                    google.maps.event.addListener(map, 'click', function(e) {
                        map.panTo(e.latLng);

                        if($scope.mapPoint)
                            return marker.setPosition(e.latLng);

                        marker = new google.maps.Marker({
                            map: map,
                            draggable: true,
                            animation: google.maps.Animation.DROP,
                            position: e.latLng,
                            icon: markerImage
                        });

                        $scope.refreshMapPoint();
                        google.maps.event.addListener(marker, "position_changed", $scope.refreshMapPoint);
                    });

                    $(".location-map", baseElement).addClass("inited");
                };

                $scope.toggleMap = function() {
                    if($scope.disabled) return false;

                    if($(".location-map", baseElement).is(":visible"))
                        $scope.closeMap();
                    else
                        $scope.showMap();
                };

                $scope.locationDoesNotMatter = function(val) {
                    $scope.errorWrongPlace = false;
                    $scope.closeMap();
                    $scope.showError = false;

                    if($scope.disabled) {
                        $scope.locations = [];
                        tagsInput.attr("disabled", "disabled");
                    } else {
                        tagsInput.removeAttr("disabled");
                    }
                };

                $scope.init = function() {

                    tagsInput = $(".tags input", baseElement);
                    sBox = addPlacesAutocompleteListener($('.tags input', baseElement)[0]);
                    $scope.$watch('disabled', $scope.locationDoesNotMatter);
                };

                $scope.$watch("showError", function(val) {
                    if(val)
                        $scope.errorWrongPlace = false;
                });
                $timeout($scope.init);
            }
        };
    }
]);