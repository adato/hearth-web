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
                ads: "="
            },
            // transclude: true,
            link: function(scope, element) {
                var markerCluster, oms, map,
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

                if(typeof templateSource !== 'string')
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

                    var marker = geo.placeMarker(geo.getLocationFromCoords(location), ad.type, ad);
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

                scope.onMarkerClick = function(marker) {

                    Post.get({
                        postId: marker.info._id
                    }, function(data) {

                        data.author.avatar.normal = data.author.avatar.normal || EMPTY_AVATAR_URL;
                        map.panTo(marker.position);

                        if (data.community_id) {
                            data.adType = data.type === 'need' ? 'WE_NEED' : 'WE_GIVE';
                        } else {
                            data.adType = data.type;
                        }
                        scope.showMarkerWindow(template(data), marker);
                    }, function(err) {});
                };

                scope.createPins = function(e, ads) {
                    var i, j, ad, location;
                    ads = ads || [];
                    markers = [];

                    markerCluster.clearMarkers();
                    oms.clearMarkers();

                    console.log("Nacetl jsem: "+ ads.length);
                    for (i = 0; i < ads.length; i++) {
                        ad = ads[i];

                        for (j = 0; j < ad.locations.length; j++) {
                            if (ad.locations[j]) {

                                if (markerLimit && scope.testPositionLimit(ad.locations[j]))
                                    continue;
                                scope.placeMarker(ad.locations[j], ad);
                            }
                        }
                    }

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