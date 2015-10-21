'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.filter
 * @description Filter rules for search
 * @restrict E
 */
angular.module('hearth.directives').directive('filter', [
    'geo', '$location', 'Auth', '$timeout', 'Filter', '$rootScope', 'KeywordsService',

    function (geo, $location, Auth, $timeout, Filter, $rootScope, KeywordsService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                filterShown: "="
            },
            templateUrl: 'templates/directives/filter.html',
            link: function (scope, element) {
                var searchBoxElement = $('input#geolocation', element),
                    searchBox = new google.maps.places.SearchBox(searchBoxElement[0]),
                    filterDefault = {
                        type: 'post',
                        post_type: null,
                        distance: 25,
                        keywords: [],
                        days: null
                    };

                var timeout = $timeout(function () {
                    $(".tags input", element).keypress(function (e) {
                        if ($(e.target).val() != '') {
                            if (e.keyCode == 9) {
                                var self = this;
                                setTimeout(function () {
                                    $(".tags input", element).focus();
                                });
                            }
                        }
                    });
                });

                scope.loggedUser = Auth.isLoggedIn();
                scope.inited = false;
                scope.filterPostCount = false;

                scope.queryKeywords = function ($query) {
                    if ($query === '' || $query.length < 3) {
                        return Filter.queryCommonKeywords($query);
                    }
                    return KeywordsService.queryKeywords($query);
                };

                scope.applyFilter = function () {
                    if ($.isEmptyObject(scope.filter)) {
                        scope.reset();
                    } else {
                        Filter.apply(scope.convertFilterToParams(scope.filter), scope.filterSave, true);
                        scope.close();
                    }
                };

                // when (un)checked checkbox for save filter - send request also to api
                scope.toggleSaveFilter = function (save) {

                    if (!$rootScope.loggedUser._id)
                        return false;

                    if (save)
                        Filter.setUserFilter(scope.convertFilterToParams(scope.filter));
                    else
                        Filter.deleteUserFilter();
                };

                scope.convertFilterToParams = function (filter) {
                    var related = [],
                        params = {};

                    if (filter.type) {
                        params.type = filter.type;
                    }
                    if (filter.post_type) {
                        params.post_type = filter.post_type;
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
                        params.keywords = $.map(filter.keywords || [], function (item) {
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

                scope.convertParamsToFilter = function (params) {
                    if (params.keywords && !$.isArray(params.keywords)) {
                        params.keywords = params.keywords.split(",");
                    }

                    var filter = {
                        type: params.type || filterDefault.type,
                        post_type: params.post_type || filterDefault.post_type,
                        days: params.days || filterDefault.days,
                        my_section: params.my_section,
                        user: (params.related || '').indexOf('user') > -1 ? true : undefined,
                        community: (params.related || '').indexOf('community') > -1 ? true : undefined,
                        keywords: $.map(params.keywords || {}, function (keyword) {
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

                scope.close = function () {
                    scope.$emit('filterClose');
                };

                scope.reset = function () {
                    Filter.reset();
                };

                scope.insertKeyword = function (keyword) {
                    var exists = false;

                    if (scope.filter.keywords) {
                        scope.filter.keywords.forEach(function (val) {
                            if (val.text === keyword)
                                exists = true;
                        });
                    }

                    if (!exists)
                        scope.filter.keywords.push({text: keyword})
                };

                scope.loadKeywords = function () {
                    Filter.getCommonKeywords(function (res) {
                        scope.commonKeywords = res;
                    });
                };

                scope.$on('filterReseted', function () {
                    scope.filter = angular.copy(filterDefault);
                    scope.filterSave = false;
                    scope.close();
                });

                google.maps.event.addListener(searchBox, 'places_changed', function () {
                    var places = searchBox.getPlaces();

                    if (places && places.length > 0) {
                        var location = places[0].geometry.location,
                            name = places[0].formatted_address;

                        scope.$apply(function () {
                            scope.filter.name = name;
                            scope.filter.lat = location.lat();
                            scope.filter.lon = location.lng();
                        });
                    }
                });
                scope.$on('filterApplied', function () {
                    scope.updateFilterByRoute();
                });

                scope.recountPosts = function () {
                    if (!scope.filterShown)
                        return false;

                    Filter.getFilterPostCount(scope.convertFilterToParams(scope.filter), function (count) {
                        scope.filterPostCount = count;
                    });
                };

                scope.updateFilterByRoute = function () {
                    var search = $location.search();
                    scope.filter = $.isEmptyObject(search) ? angular.copy(filterDefault) : scope.convertParamsToFilter(search);
                };
                scope.updateFilterByRoute();

                scope.init = function () {
                    scope.inited = true;
                    scope.loadKeywords();

                    if ($rootScope.user && $rootScope.user.filter && Object.keys($rootScope.user.filter).length)
                        scope.filterSave = true;
                };

                scope.$watch('filter', scope.recountPosts, true);
                scope.$watch('filterShown', scope.recountPosts);
                // scope.$watch('filterSave', scope.toggleSaveFilter);
                scope.$on('initFinished', scope.init);
                $rootScope.initFinished && scope.init();

                scope.$on('$destroy', function () {
                    scope.searchBoxElement = null;
                    scope.searchBox = null;
                    $timeout.cancel(timeout);
                    $(".tags input", element).unbind('keypress');
                })
            }
        };
    }
]);
