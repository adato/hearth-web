'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.avatar
 * @description 
 * @restrict E
 */

angular.module('hearth.directives').directive('avatar', [
	function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				'src': '=',
				'size': '@',
				'type': '=',
				'href': '='
			},
			templateUrl: 'templates/directives/avatar.html',
			link: function($scope) {
				$scope.class = "avatar-" + ($scope.size || 'normal') + ' ' + (($scope.type === 'Community') ? 'avatar-community' : 'avatar-user');
			}
		};
	}
]);