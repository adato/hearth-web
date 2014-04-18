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
			link: function(scope, el, attrs) {
				scope.showAutodetect = false;
				scope.emptyFocusFn = function() {
					return scope.showAutodetect = true;
				};
				scope.editLocation = function() {
					return scope.editingLocation = true;
				};
				scope.autodetectMyLocation = function() {
					return Geocoder.findMeAndGeocode().then(function(geocodedLocation) {
						return scope.location = geocodedLocation;
					});
				};
				scope.$watch('location', function(newval, oldval) {
					scope.editingLocation = false;
					if ((newval != null) && newval !== oldval && oldval !== undefined) {
						scope.saveLocation();
					}
					if (newval == null) {
						return scope.editLocation();
					}
				});
				return scope.saveLocation = function() {
					var location, _ref;
					if (!scope.location) {
						return;
					}
					scope.editingLocation = false;
					location = Geocoder.latLonToGeoJson(scope.location);
					if (((_ref = scope.loggedUser) != null ? _ref._id : void 0) == null) {
						scope.setLocationFn({
							location: scope.location
						});
						return;
					}
					location.id = scope.loggedUser._id;
					return UserLocation.add(location, function(data) {
						return scope.setLocationFn({
							location: scope.location
						});
					});
				};
			}
		};
	}
]);