'use strict';

/**
 * @ngdoc directive
 * @name hearth.utils.abTest
 * @description
 * @restrict A
 */

angular.module('hearth.utils').directive('abTest', ['LocalStorage', '$window', '$analytics', 'Ab',
	function(LocalStorage, $window, $analytics, Ab) {
		return {
			replace: true,
			transclude: true,
			scope: {},
			restrict: 'E',
			template: '<span><span ng-if=":: variant == userVariant" ng-transclude ng-click="log(\'click\');"></span></span>',
			link: function($scope, element, attr) {

				var DROPDOWN_VARIANT = 'ab-variant-v2';

				$scope.userVariant = '';

				var getUserVariant = function() {
					var variant = Ab.getItem(DROPDOWN_VARIANT);
					return variant;
				}

				var setUserVariant = function(variant) {
					Ab.setItem(DROPDOWN_VARIANT, variant);
				}

				var getRandomVariant = function() {
					var getRandom = function() {
						try {
							// array to hold an unsigned 16-bit integer
							var ary = new Uint16Array(1);

							// fill the array with a cryptographically random number
							// supported in Chrome 11.0+; FireFox 21.0+; IE 11.0+; Opera 15.0+; Safari 3.1+
							// Note: even where supported could throw QuotaExceededError when entropy is low
							$window.crypto.getRandomValues(ary);

							// divide by 2^16
							return ary[0] / 65536;
						} catch (e) {
							return Math.random();
						}
					}
					var ret = parseInt(getRandom() * 2);
					return ret;
				}

				$scope.log = function(what) {
					$analytics.eventTrack('Dropdown ' + what + 'ed (Post)', {
						'Variant': $scope.variant,
						'Variant Name': attr.name,
					});
				}

				$scope.variant = attr.variant;

				// if window has no cached variant, cache it
				if (typeof $window.userAbVariant == 'undefined') {
					var gotVariant = getUserVariant();
					if (gotVariant !== undefined && gotVariant !== null) {
						$scope.userVariant = gotVariant;
						$window.userAbVariant = gotVariant;
					} else {
						$scope.userVariant = getRandomVariant();
						setUserVariant($scope.userVariant);
						$window.userAbVariant = $scope.userVariant;
					}
				} else {
					$scope.userVariant = $window.userAbVariant;
				}
			}
		};
	}
]);