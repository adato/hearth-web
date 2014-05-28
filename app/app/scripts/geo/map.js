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
				'locations': '='
			},
			template: '<div id="map-canvas" style="height: 300px">map</div>',
			link: function(scope) {
				var map = geo.createMap($('#map-canvas')[0]);

				geo.focusCurrentLocation(map);
			}
		};
	}
]);