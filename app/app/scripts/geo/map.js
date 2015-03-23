'use strict';

/**
 * @ngdoc directive
 * @name hearth.geo.map
 * @description Renders Map with pins
 *
 * @restrict E
 * @requires geo
 * @requires $interpolate
 * @requires $templateCache
 */
angular.module('hearth.geo').directive('map', [
    'geo', '$interpolate', '$templateCache', 'Post', '$location', '$route', '$timeout',

    function(geo, $interpolate, $templateCache, Post, $location, $route, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ads: "=",
                center: "="
            },
            // transclude: true,
            link: function(scope, element) {
                var markerCluster, oms, map,
                    I_ID = 0,
                    I_TYPE = 1,
                    I_LOCATION = 2,
                    infoWindow = new google.maps.InfoWindow(),
                    template = "",
                    templateSource = $templateCache.get('templates/geo/markerTooltip.html'),
                    markerClusterMaxZoom = 12,
                    markers = [],
                    markerLimitActive = true,
                    markerLimit = 20,
                    markerLimitValues = {},
                    markerClusterStyles = [{
                        url: "images/marker/circle.png",
                        textColor: "white",
                        width: 27,
                        height: 27,
                    }, {
                        url: "images/marker/circle.png",
                        textColor: "white",
                        width: 27,
                        height: 27,
                    }, {
                        url: "images/marker/circle2.png",
                        textColor: "white",
                        width: 34,
                        height: 34,
                    }, {
                        url: "images/marker/circle3.png",
                        textColor: "white",
                        width: 40,
                        height: 40,
                    }, {
                        url: "images/marker/circle3.png",
                        textColor: "white",
                        width: 40,
                        height: 40,
                    }];

                if (typeof templateSource !== 'string')
                    templateSource = templateSource[1];

                template = $interpolate(templateSource);

                scope.initMap = function() {
                    if (!map) {
                        $timeout(function() {
                            map = geo.createMap(element[0], {
                                zoom: 11
                            });

                            google.maps.event.trigger(map, "resize");
                            geo.focusCurrentLocation();

                            oms = new OverlappingMarkerSpiderfier(map, {
                                markersWontMove: true,
                                markersWontHide: true,
                                keepSpiderfied: true,
                            });

                            markerCluster = new MarkerClusterer(map, [], {
                                ignoreHidden: true,
                                maxZoom: markerClusterMaxZoom,
                                zoomOnClick: true,
                                gridSize: 40,
                                averageCenter: true,
                                styles: markerClusterStyles
                            });

                            markerCluster.addListener('click', scope.zoomMarkerClusterer);
                            oms.addListener('click', scope.onMarkerClick);
                        }, 100);
                    }
                };

                scope.testPositionLimit = function(loc) {

                    var lat = parseFloat(loc[0]).toFixed(4),
                        lng = parseFloat(loc[1]).toFixed(4),
                        key = "" + lat + ":" + lng;

                    markerLimitValues[key] = markerLimitValues[key] ? markerLimitValues[key] + 1 : 1;
                    return markerLimitValues[key] > markerLimit;
                };

                scope.placeMarker = function(location, ad) {

                    var marker = geo.placeMarker(geo.getLocationFromCoords(location), ad[I_TYPE] == 0 ? 'need' : 'offer', ad);
                    oms.addMarker(marker);
                    markers.push(marker);
                };

                scope.showMarkerWindow = function(content, marker) {
                    var width = $(".gm-style").css("width");

                    infoWindow.setOptions({
                        maxWidth: (parseInt(width) - 200)
                    });

                    infoWindow.setContent(content);
                    infoWindow.open(map, marker);

                    $('.marker-tooltip').click(function() {
                        var itemId = $(this).attr('itemid');

                        scope.$apply(function() {

                            var path = $location.path('ad/' + itemId);
                        });
                    });
                };

                // this will zoom to show all markers and center map view
                scope.centerZoomToAll = function(markers) {
                    map.fitBounds(markers.reduce(function(bounds, marker) {
                        return bounds.extend(marker.getPosition());
                    }, new google.maps.LatLngBounds()));
                };

                scope.onMarkerClick = function(marker) {

                    Post.get({
                        postId: marker.info[I_ID]
                    }, function(data) {

                        data.author.avatar.normal = data.author.avatar.normal || $$config.defaultUserAvatar;
                        map.panTo(marker.position);

                        if (data.community_id) {
                            data.adType = data === 'need' ? 'WE_NEED' : 'WE_GIVE';
                        } else {
                            data.adType = data.type;
                        }
                        scope.showMarkerWindow(template(data), marker);
                    }, function(err) {});
                };

                scope.isInDistance = function(maxDist, base, point) {

                    var dist = google.maps.geometry.spherical.computeDistanceBetween(
                        new google.maps.LatLng(base.lat, base.lng), geo.getLocationFromCoords(point)
                        );

                    return maxDist > dist / 1000;  // transfer to km
                }

                scope.createPins = function(e, ads) {
                    var i, j, ad, location, distanceBase, distance = false;
                    ads = ads || [];
                    markers = [];

                    markerCluster.clearMarkers();
                    oms.clearMarkers();

                    if (typeof $location.search().distance != 'undefined') {
                        distance = parseInt($location.search().distance, 10);
                        distanceBase = {
                            lat: $location.search().lat,
                            lng: $location.search().lon
                        };
                    }

                    // console.log("Nacetl jsem: " + ads.length);
                    for (i = 0; i < ads.length; i++) {
                        ad = ads[i];

                        for (j = 0; j < ad[I_LOCATION].length; j++) {
                            if (ad[I_LOCATION][j]) {

                                if (
                                    (distance && !scope.isInDistance(distance, distanceBase, ad[I_LOCATION][j]) )
                                     ||
                                    markerLimit && scope.testPositionLimit(ad[I_LOCATION][j])
                                ){
                                    continue;
                                }
                                scope.placeMarker(ad[I_LOCATION][j], ad);
                            }
                        }
                    }

                    if(scope.center)
                        scope.centerZoomToAll(markers);
                    markerCluster.addMarkers(markers);
                    markerCluster.repaint();
                };

                scope.zoomMarkerClusterer = function(cluster) {

                    map.fitBounds(cluster.getBounds());
                    map.setZoom(markerClusterMaxZoom + 1);
                };

                scope.$on('initMap', scope.initMap);
                scope.$on('showMarkersOnMap', scope.createPins);
            }
        };
    }
]);