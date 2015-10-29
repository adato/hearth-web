'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.karmaBar
 * @description 
 * @restrict A
 */

angular.module('hearth.directives').directive('karmaBar', [
	'$rootScope', 'Karma',
	function($rootScope, Karma) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				up: "=",
				down: "="
			},
			templateUrl: 'templates/directives/karmaBar.html',
			link: function(scope, el, attrs) {
				scope.karma = Karma.count(scope.up, scope.down);
			}
		};
	}
]);