'use strict';

/**
 * @ngdoc directive
 * @name hearth.utils.abTest
 * @description
 * @restrict A
 */

angular.module('hearth.utils').directive('abTest', [
	function() {
		return {
			replace: true,
			transclude: true,
			restrict: 'E',
			scope: {
				'variant': '='
			},
			template: '<div>variant: {{ variant }}<span style="font-size:larger" ng-transclude></span></div>',
			link: function($scope) {
				console.log('iam here');
			}
		};
	}
]);