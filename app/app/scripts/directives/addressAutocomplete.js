'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.addressAutocomplete
 * @description 
 * @restrict E
 */

angular.module('hearth.directives').directive('addressAutocomplete', [
	'$timeout',
	function($timeout) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				'connections': '@',
				'placeholders': '=',
				'location': '=',
				'isRequired': '=',
				'onEmpty': '&',
				'focus': '&',
				'blur': '&'
			},
			controller: [
				'$scope', '$timeout',
				function($scope) {
					$scope.$watch('location', function(newval) {
						if (newval && newval.name) {
							return $scope.setLocation(newval);
						} else {
							$scope.locationName = '';
							return $scope.locationName;
						}
					});
					$scope.setLocation = function(location) {
						$scope.locationName = location.name;
						$scope.location = location || null;
						location.enabled = true;
						return location.enabled;
					};
				}
			],
			template: '<input type="text" class="location text-input" placeholder="{{ placeholders | translate }}"' + ' ng-model="locationName" ng-focus="focus()" ng-blur="doBlur()" ng-required="isRequired" />',
			link: function(scope, el) {
				var init, inputElement;
				scope.doBlur = function() {
					return $timeout(function() {
						return scope.blur();
					}, 100);
				};
				inputElement = el[0];
				angular.element(inputElement).bind('focus', function() {
					return scope.$apply(function() {
						scope.locationName = '';
						if (!scope.initted) {
							init();
						}
						if (scope.onEmpty && !scope.locationName) {
							return scope.onEmpty();
						}
					});
				});
				init = function() {
					var autocomplete;
					scope.initted = true;
					autocomplete = new google.maps.places.Autocomplete(inputElement);
					google.maps.event.addDomListener(inputElement, 'keydown', function(e) {
						if (e.keyCode === 13) {
							e.preventDefault();
						}
						return $('body > .pac-container').filter(':visible').bind('DOMNodeInserted DOMNodeRemoved', function() {
							return $('.pac-item').addClass('needsclick');
						});
					});
					return google.maps.event.addListener(autocomplete, 'place_changed', function() {
						var place;
						place = autocomplete.getPlace();
						if (!(place.geometry || place.geometry.location)) {
							return;
						}
						return scope.$apply(function() {
							var location;
							location = {
								coordinates: [place.geometry.location.lng(), place.geometry.location.lat()],
								name: place.formatted_address,
								type: 'Point',
								enabled: true
							};
							return scope.setLocation(location);
						});
					});
				};
				return init;
			}
		};
	}
]);