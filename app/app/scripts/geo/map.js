'use strict';

angular.module('hearth.geo').directive('map', [
	'geo',
	function(geo) {
		var mapConfig = {
			zoom: 6,
			zoomControl: true,
			mapTypeControl: false,
			streetViewControl: false,
			center: new google.maps.LatLng(0, 0),
			draggableCursor: 'crosshair',
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.LEFT_CENTER
			}
		};
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			scope: {
				'ads': '='
			},
			template: '<div id="map-canvas" style="height: 300px">map</div>',
			link: function(scope, element) {
				var i, j, ad, location;

				geo.createMap($('#map-canvas')[0]);
				geo.focusCurrentLocation();

				scope.$watch('ads', function() {
					for (i = 0; i < scope.ads.length; i++) {
						ad = scope.ads[i];
						for (j = 0; j < ad.locations.length; j++) {
							location = ad.locations[j];
							geo.placeMarker(geo.getLocationFromCoords(location.coordinates), undefined, ad.type);
						}
					}
				});
			}
		};
	}
]);