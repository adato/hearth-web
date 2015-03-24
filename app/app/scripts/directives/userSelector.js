'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.userSelector
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('userSelector', [
	'$rootScope', '$timeout', 'Communities',
	function($rootScope, $timeout, Communities) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				users: '=',
				disable: '=',
			},
			templateUrl: 'templates/directives/userSelector.html',
			link: function($scope, baseElement) {
				$scope.myCommunities = [];
				$scope.list = {
					users: $scope.users
				};
				$scope.$watch("users", function(val) {
					$scope.list.users = val;
				});
				$scope.$watch("list.users", function(val) {
					$scope.users = val;
				});
				$rootScope.$watch("myCommunities", function(val) {
					$scope.myCommunities = val;
				});
			}
		};
	}
]);