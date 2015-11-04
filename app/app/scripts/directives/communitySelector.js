'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.communitySelector
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('communitySelector', [
	'$rootScope', '$timeout', 'Communities',
	function($rootScope, $timeout, Communities) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				communities: '=',
				disable: '=',
			},
			templateUrl: 'templates/directives/communitySelector.html',
			link: function($scope, baseElement) {
				$scope.myCommunities = [];
				$scope.list = {
					communities: $scope.communities
				};

				$scope.$watch("communities", function(val) {
					$scope.list.communities = val;
				});

				$rootScope.$watch("myCommunities", function(val) {
					$scope.myCommunities = val;
				});

				$scope.$watch("list.communities", function(val) {
					$scope.communities = val;
				});
			}
		};
	}
]);