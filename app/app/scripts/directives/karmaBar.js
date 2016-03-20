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
				for: "=",
			},
			templateUrl: 'templates/directives/karmaBar.html',
			link: function(scope, el, attrs) {
				scope.up = scope.for.up_votes;
				scope.down = scope.for.down_votes;
				scope.karma = Karma.count(scope.up, scope.down);
			}
		};
	}
]);