'use strict';
/**

 * @ngdoc directive
 * @name hearth.geo.setLocation
 * @description 
 * @restrict E
 * @requires $timeout
 * @requires Geocoder
 */
 
angular.module('hearth.geo').directive('setLocation', [
	'$timeout', 'Geocoder',
	function($timeout, Geocoder) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				location: '=',
				loggedUser: '=',
				setLocationFn: '&'
			},
			templateUrl: 'templates/geo/userLocationDirective.html',
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