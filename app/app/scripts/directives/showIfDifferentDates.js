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
			template: '<div ng-show="showMe" ng-transclude></div>',
			link: function($scope, el, attrs) {
				$scope.showMe = ! $scope.oldDate || $filter('ago')($scope.oldDate) != $filter('ago')($scope.newDate);
			}
		};
	}
]);