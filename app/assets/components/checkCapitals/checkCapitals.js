'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.checkCapitals
 * @description
 * @restrict A
 */
angular.module('hearth.directives').directive('checkCapitals', [
	function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				model: '=',
			},
			template: '<div><span ng-if="isLoud" translate="COMMON.NOTIFY.ERROR_TEXT_TOO_LOUD"></span></div>',
			link: function(scope, element, attrs) {

				scope.isLoud = false;
				scope.threshold = 0.8; // 80% maximum uppercase letters

				var isUppercase = function(value) {
					var uppercased = 0;
					value.split('').forEach(function(letter) {
						// skip numbers
						if (letter && parseInt(letter) != letter && letter.toUpperCase() === letter) {
							uppercased++;
						}
					})
					var uppercasePercent = uppercased / value.length;
					return (uppercasePercent > scope.threshold);
				}

				scope.$watch('model', function(newVal, oldVal) {
					if (typeof newVal != 'undefined' && newVal !== null && newVal != '') {
						scope.isLoud = isUppercase(newVal);
					}
				});
			}
		};
	}
]);