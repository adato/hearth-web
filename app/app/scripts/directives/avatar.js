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
			link: function($scope, el, attrs) {
				$scope.defaultImageType = $$config.defaultUserAvatar;
				$scope.class = "avatar-" + ($scope.size || 'normal');

				$scope.$watch('type', function(val) {
					$scope.defaultImageType = val === 'Community' ? $$config.defaultCommunityAvatar : $$config.defaultUserAvatar;
				});

				$scope.$watch('src', function(val) {
					$scope.image = val || $scope.defaultImageType;
				});
			}
		};
	}
]);
