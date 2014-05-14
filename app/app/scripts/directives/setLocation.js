'use strict';

angular.module('hearth.directives').directive('setLocation', [
	'$timeout', 'Geocoder', 'UserLocation',
	function($timeout, Geocoder, UserLocation) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				location: '=',
				loggedUser: '=',
				setLocationFn: '&'
			},
			templateUrl: 'templates/userLocationDirective.html',
			link: function(scope) {
				scope.showAutodetect = false;
				scope.emptyFocusFn = function() {
					scope.showAutodetect = true;
				};

				scope.autodetectMyLocation = function() {
					return Geocoder.findMeAndGeocode().then(function(geocodedLocation) {
						scope.location = geocodedLocation;
						scope.setLocationFn({
							location: scope.location
						});
					});
				};
				scope.autodetectMyLocation();

				scope.search = function() {
					scope.setLocationFn({
						location: Geocoder.latLonToGeoJson(scope.location)
					});
				};
			}
		};
	}
]);