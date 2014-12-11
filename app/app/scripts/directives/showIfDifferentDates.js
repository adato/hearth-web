'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.showIfDifferentDates
 * @description 
 * @restrict E
 */

angular.module('hearth.directives').directive('showIfDifferentDates', [
	'$filter',
	function($filter) {
		return {
		    transclude:true,
			restrict: 'A',
			scope: {
				oldDate: "=",
				newDate: "=",
			},
			template: '<div ng-show="showMe" old="{{oldDate}}" new="{{newDate}}" ng-transclude></div>',
			link: function($scope, el, attrs) {
				$scope.showMe = false;

				function refresh() {
					$scope.showMe = $filter('ago')($scope.oldDate) != $filter('ago')($scope.newDate);
				}

				$scope.$watch("oldDate", refresh);
				$scope.$watch("newDate", refresh);
				refresh();
			}
		};
	}
]);