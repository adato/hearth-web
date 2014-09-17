'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.pluralizeTranslate
 * @description 
 * @restrict E
 */

angular.module('hearth.directives').directive('pluralizeTranslate', [
	'$translate',
	function($translate) {
		return {
			transclude: false,
			restrict: 'E',
			scope: {
				count: "=",
				key: "=",
			},
			template: '<span ng-pluralize count="count" when="translateStrings"></span>',
			link: function($scope, el, attrs) {
				$scope.$watch("key", function(key) {
					$scope.translateStrings = JSON.parse($translate(key));
				});
			}
		};
	}
]);