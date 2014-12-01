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
				$scope.classType = "";
				$scope.class = "avatar-"+$scope.size;

				$scope.$watch('href', function(val) {
					$scope.href = val;
				});

				$scope.$watch('type', function(val) {
					$scope.defaultImageType = val === 'Community' ? $$config.defaultCommunityAvatar : $$config.defaultUserAvatar;
					$scope.classType = "avatar"+val;
				});

				$scope.$watch('src', function(val) {
					$scope.image = val || $scope.defaultImageType;
				});
			}
		};
	}
]);