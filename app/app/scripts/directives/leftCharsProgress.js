'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.leftCharsProgress
 * @description M
 * @restrict E
 */
angular.module('hearth.directives').directive('leftCharsProgress', [

	function() {
		return {
			replace: true,
			restrict: 'E',
			scope: {
				value: '=',
				max: '='
			},
			template: '<span ng-style="css" class="charsleft" ng-class="{warn:warn}">Zbyva {{charsLeft}} znaku</span>',
			link: function(scope) {
				scope.$watch('value', function(value) {
					scope.charsLeft = parseInt(scope.max, 10) - (value || '').length;
					scope.percent = Math.min((value || '').length / parseInt(scope.max, 10), 1);
					scope.css = {
						opacity: scope.percent
					};
					scope.warn = scope.percent > 0.95;
				});
			}
		};
	}
]);