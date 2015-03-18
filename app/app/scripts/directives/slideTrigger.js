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
		template: 	'<label ng-click="trigger()" class="fa" ng-class="{\'fa-chevron-up\':slideTrigger, \'fa-chevron-down\':!slideTrigger}"><ng-transclude></ng-transclude> '+
					'<i></i>'+
					'</label>',
		link: function($scope) {
			$scope.trigger = function() {
				$scope.slideTrigger = !$scope.slideTrigger;
			};
		}
	};
}]);