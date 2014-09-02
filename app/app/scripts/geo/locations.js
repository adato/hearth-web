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
                limit: '='
            },
            templateUrl: 'templates/geo/locations.html',
            link: function(scope, baseElement) {
                var map, marker;
                scope.mapDisplay = -1;

                window.tmp = scope.locations;

                function getDefaultLocation() {

                    return {
                        type: 'Point',
                        name: '',
                        coordinates: null
                    };
                }

                function placeMarker(position, map) {
                    if (marker) {
                        marker.setMap(null);
                    }
                    marker = geo.placeMarker(position, 'pin', null, map);
                    map.panTo(position);
                };

                function initSearchBoxes() {

                    $('.map-input', baseElement).each(function(index) {
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
                            var places = sBox.getPlaces();
                            if (!places) {
                                scope.clearLocation(index);
                            }
                        });
                    });
                }

                scope.translateLocation = function(loc) {
                    var short = {},
                        long = {};
                    
                    if(loc) {
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
                        city: long.postal_town || long.locality, // mestska cast nebo jen mesto
                        area: long.administrative_area_level_1, // kraj
                    };
                };

                scope.clearLocation = function(index) {
                    scope.locations[index] = getDefaultLocation();
                };

                scope.fillLocation = function(index, pos, addr, info) {
                    scope.locations[index] = {
                        name: addr,
                        coordinates: [pos.lng(), pos.lat()]
                    };

                    if($.isPlainObject(info)) {
                        Object.keys(info).forEach(function(key) {
                            scope.locations[index][key] = info[key];
                        });
                    }
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

                    scope.locations.splice($index, 1);

                    if (scope.mapDisplay == $index)
                        scope.closeMap();
                };

                scope.removeAll = function() {

                    for (var len = scope.locations.length - 1; len + 1; len--) {
                        scope.remove(null, len);
                    }
                }

                scope.add = function() {
                    scope.locations.push(getDefaultLocation());
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

                setTimeout(initSearchBoxes);


                //               var searchBoxbaseElement = [0],
                //                   // searchBoxbaseElement.blur(function() {
                //                   //     var places = searchBox.getPlaces();
                //                   //     alert("CLEAR");
                //                   // });


                // $(searchBoxbaseElement).click(function() {
                //  alert("AA");
                // });
                //                   google.maps.event.addListener(searchBox, 'places_changed', function() {
                //                       var places = searchBox.getPlaces();

                //                       if (places && places.length > 0) {
                //                           var location = places[0].geometry.location,
                //                               name = places[0].formatted_address;

                //                           alert(name);
                //                       }
                //                   });

                // }

                // var marker, map, searchBox, editedLocationIndex,
                //  initMap = function() {
                // var mapbaseElement = $('#map', scope.dialog[0]),
                //  searchBoxbaseElement = $('input', scope.dialog[0]);

                // map = geo.createMap(mapbaseElement[0], {
                //  draggableCursor: 'url(images/pin.png) 14 34, default'
                // });
                //      searchBox = new google.maps.places.SearchBox(searchBoxbaseElement[0]);

                //      google.maps.event.addListener(map, 'click', function(e) {
                //          placeMarker(e.latLng, map);
                //          geo.getAddress(e.latLng).then(function(address) {
                //              scope.selectedName = address;
                //              searchBoxbaseElement.val(address);
                //          });
                //      });
                //      searchBoxbaseElement.blur(function() {
                //          var places = searchBox.getPlaces();
                //          if (!places) {
                //              clearLocation();
                //          }
                //      });
                //      searchBoxbaseElement.change(function() {
                //          if (!searchBoxbaseElement.val()) {
                //              clearLocation();
                //          }
                //      });

                //      if (editedLocationIndex !== undefined && scope.locations[editedLocationIndex].coordinates) {
                //          var location = scope.locations[editedLocationIndex],
                //              position = geo.getLocationFromCoords(location.coordinates);

                //          scope.$apply(function() {
                //              setLocation(location.name, position);
                //          });
                //          searchBoxbaseElement.val(location.name);
                //          placeMarker(position, map);
                //      } else {
                //          geo.getCurrentLocation().then(function(position) {
                //              placeMarker(position, map);
                //              geo.getAddress(position).then(function(address) {
                //                  $timeout(function() {
                //                      setLocation(address, position);
                //                  });
                //                  searchBoxbaseElement.val(address);
                //              });
                //          });
                //      }
                //  },
                //  clearLocation = function() {
                //      scope.$apply(function() {
                //          setLocation('', []);
                //      });
                //      if (marker) {
                //          marker.setMap(null);
                //      }
                //  },
                //  setLocation = function(address, position) {
                //      scope.selectedName = address;
                //      scope.selectedPosition = position;
                //  },
                //  placeMarker = function(position, map) {
                //      if (marker) {
                //          marker.setMap(null);
                //      }
                //      marker = geo.placeMarker(position, 'pin', null, map);
                //      map.panTo(position);
                //      scope.selectedPosition = position;
                //  };

                // scope.init = function(id) {
                //  scope.dialogSelector = '#location-map' + id;
                //  scope.dialog = $(scope.dialogSelector);

                //  $(document).on('opened', scope.dialogSelector + '[data-reveal]', function() {
                //      initMap();
                //  });
                // };

                // scope.$watch('itemid', function(value) { //ad edit
                //  if (!scope.dialog && value) {
                //      scope.init(value);
                //  }
                // });

                // scope.editLocation = function(index, $event) {
                //  if (!scope.dialog) { //new add
                //      scope.init('');
                //  }
                //  editedLocationIndex = index;
                //  scope.dialog.foundation('reveal', 'open');
                //  $event.preventDefault();
                // };

                // scope.close = function() {
                //  scope.dialog.foundation('reveal', 'close');
                //  $('.pac-container').remove(); //google maps forget this
                // };

                // scope.ok = function() {
                //  scope.locations[editedLocationIndex] = {
                //      type: 'Point',
                //      name: scope.selectedName,
                //      coordinates: [
                //          scope.selectedPosition.lng(),
                //          scope.selectedPosition.lat()
                //      ]
                //  };
                //  scope.close();
                // };
            }
        };
    }
]);