'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.slideTrigger
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('slideTrigger', [
	'$rootScope', '$timeout',
	function($rootScope, $timeout) {
	return {
		restrict: 'A',
		replace: true,
		transclude: true,
		scope: {
			slideTrigger: '=',
		},
		template: 	'<label ng-click="trigger()">'+
					'<i class="fa" ng-class="{\'fa-chevron-up\':slideTrigger, \'fa-chevron-down\':!slideTrigger}"></i>'+
					'<ng-transclude></ng-transclude> ' +
					'</label>',
		link: function($scope) {
			$scope.trigger = function() {
				$scope.slideTrigger = !$scope.slideTrigger;
			};
		}
	};
}]);