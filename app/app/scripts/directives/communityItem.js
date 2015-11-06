'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.communityItem
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('communityItem', [
	'$rootScope',
	function($rootScope) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			scope: {
				item: '=',
				user: '='
			},
			templateUrl: 'templates/directives/communityItem.html',
			link: function(scope, element) {
				scope.getProfileLink = $rootScope.getProfileLink;
			}
		};
	}
]);