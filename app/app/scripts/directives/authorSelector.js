'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.authorSelector
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('authorSelector', [
	'$rootScope',
	function($rootScope) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			authorId: '=',
			remove: '=',
		},
		templateUrl: 'templates/directives/authorSelector.html',
		link: function($scope) {
			$scope.list = [];

			$rootScope.$watch('myAdminCommunities', function(val) {
				$scope.list = [$rootScope.loggedUser];
				if($rootScope.myAdminCommunities)
					$scope.list = $scope.list.concat($rootScope.myAdminCommunities);
				
				$scope.selectedIndex = $scope.setByIndex(0);
				if($scope.authorId)
					$scope.setByAuthorId($scope.authorId);

			}, true);
			
			$scope.selectAuthor = function(index) {
				console.log(index, $scope.list[index]);
				$scope.selectedIndex = index;
				$scope.authorId = $scope.list[index]._id;
			};

			$scope.setByAuthorId = function(id) {
				for(var i = 0; i < $scope.list.length; i++) {
					if($scope.list[i]._id == id) {
						return $scope.selectedIndex = i;
					}
				}
			};

			$scope.setByIndex = function(index) {
				return $scope.selectedIndex = index;
			};

			$scope.$watch('authorId', $scope.setByAuthorId);
		}
	};
}]);