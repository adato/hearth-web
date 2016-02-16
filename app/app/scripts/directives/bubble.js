'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.bubble
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('bubble', [
	'$rootScope', 'User',
	function($rootScope, User) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				type: '@'
			},
			templateUrl: 'templates/directives/bubble.html',
			link: function(scope, element, attrs) {
				var bubble = $('.bubble-container').first();
				bubble.show();

				scope.removeReminder = $rootScope.removeReminder;
			}
		};
	}
]);