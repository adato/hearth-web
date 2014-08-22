'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.filter
 * @description Filter rules for search
 * @restrict E
 */
angular.module('hearth.directives').directive('filter', [
    'geo', 'KeywordsService', '$location', 'Auth', '$timeout',

    function(geo, KeywordsService, $location, Auth, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope: {

            },
            templateUrl: 'templates/directives/filter.html',
            link: function(scope, element) {
                var searchBoxElement = $('input#geolocation', element),
                    searchBox = new google.maps.places.SearchBox(searchBoxElement[0]),
                    filterDefault = {
                        type: '',
                        distance: 25,
                        days: ''
                    };

                $timeout(function () {
                    $(".tags input", element).keypress(function(e) {
                        if (e.keyCode == 9) {
                            var self = this;
                            setTimeout(function() {
                                $(".tags input", element).focus();
                            });
                        }
                    });
                });

                scope.loggedUser = Auth.isLoggedIn();

                scope.applyFilter = function() {

                    if ($.isEmptyObject(scope.filter)) {
                        scope.reset();
                    } else {
                        scope.$emit('filterApply', scope.convertFilterToParams(scope.filter), scope.filterSave);
                        scope.close();
                    }
                };

                scope.convertFilterToParams = function(filter) {
                    var related = [],
                        params = {};

                    if (filter.type) {
                        params.type = filter.type;
                    }
                    if (filter.days) {
                        params.days = filter.days;
                    }
                    if (filter.my_section) {
                        params.my_section = filter.my_section;
                    }
                    if (filter.user) {
                        related.push('user');
                    }
                    if (filter.community) {
                        related.push('community');
                    }
                    if (related.length) {
                        params.related = related.join(',');
                    }
                    if (filter.keywords.length) {
                        params.keywords = $.map(filter.keywords || [], function(item) {
                            return item.text;
                        }).join(',');
                    }

                    if (filter.lon && filter.lat && filter.name) {
                        params.lon = filter.lon;
                        params.lat = filter.lat;
                        params.name = filter.name;
                        params.distance = parseInt(filter.distance) + $$config.lengthUnit;
                    }
                    return params;
                };

                scope.convertParamsToFilter = function(params) {
                    if(! $.isArray(params.keywords)) {
                        params.keywords = params.keywords.split(",");
                    }

                    var filter = {
                        type: params.type || filterDefault.type,
                        days: params.days || filterDefault.days,
                        my_section: params.my_section,
                        user: (params.related || '').indexOf('user') > -1 ? 'true' : undefined,
                        community: (params.related || '').indexOf('community') > -1 ? 'true' : undefined,
                        keywords: $.map(params.keywords || {}, function(keyword) {
                            return {
                                text: keyword
                            };
                        }),
                        lon: params.lon,
                        lat: params.lat,
                        name: params.name,
                        distance: parseInt((params.distance || filterDefault.distance)),
                    };

                    if (filter.name === '') {

                        delete filter.lon;
                        delete filter.lat;
                        delete filter.name;
                        delete filter.distance;
                    }

                    return filter;
                };

                scope.close = function() {
                    scope.$emit('filterClose');
                };

                scope.reset = function() {
                    scope.$emit('filterReset');
                };

                scope.queryKeywords = function($query) {
                    return KeywordsService.queryKeywords($query);
                };

                scope.$on('resetFilterData', function() {
                    scope.filter = angular.copy(filterDefault);
                    scope.close();
                });

                google.maps.event.addListener(searchBox, 'places_changed', function() {
                    var places = searchBox.getPlaces();

                    if (places && places.length > 0) {
                        var location = places[0].geometry.location,
                            name = places[0].formatted_address;

                        scope.$apply(function() {
                            scope.filter.name = name;
                            scope.filter.lat = location.lat();
                            scope.filter.lon = location.lng();
                        });
                    }
                });

                // scope.$watch('place', function(value) {
                //     console.log(value);
                //     if (!value && scope.filter) {
                //         delete scope.filter.lat;
                //         delete scope.filter.lon;
                //         delete scope.filter.name;
                //     }
                // });

                scope.$on('$routeUpdate', function() {
                    scope.updateFilterByRoute();
                });

                scope.updateFilterByRoute = function() {
                    var search = $location.search();
                    scope.filter = $.isEmptyObject(search) ? angular.copy(filterDefault) : scope.convertParamsToFilter(search);
                };
                scope.updateFilterByRoute();

            }
        };
    }
]);