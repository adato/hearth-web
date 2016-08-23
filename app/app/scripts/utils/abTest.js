'use strict';

/**
 * @ngdoc directive
 * @name hearth.utils.abTest
 * @description
 * @restrict A
 */

angular.module('hearth.utils').directive('abTest', ['LocalStorage', '$window', '$analytics',
	function(LocalStorage, $window, $analytics) {
		return {
			replace: true,
			transclude: true,
			restrict: 'E',
			scope: {
				'variant': '=',
				'name': '='
			},
			template: '<span><span ng-if="variant == userVariant" ng-transclude ng-click="log(\'click\');"></span></span>',
			link: function($scope) {
				$scope.userVariant = '';

				var getUserVariant = function() {
					var variant = LocalStorage.get('ab-variant');
					return variant;
				}

				var setUserVariant = function(variant) {
					return LocalStorage.set('ab-variant', variant);
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
					$analytics.eventTrack('AB variant ' + what + 'ed', {
						'Variant': $scope.variant,
						'Variant Name': $scope.name,
					});
				}

				// if window has no cached variant, cache it
				if (typeof $window.userAbVariant == 'undefined') {
					var gotVariant;
					if (typeof(gotVariant = getUserVariant()) != 'undefined' && gotVariant !== null) {
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