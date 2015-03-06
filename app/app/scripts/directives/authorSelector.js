'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.authorSelector
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('authorSelector', [
	'$rootScope', '$timeout',
	function($rootScope, $timeout) {
	return {
		restrict: 'AE',
		replace: true,
		scope: {
			author: '=',
			removeId: '=remove',
			onChange: '&',
		},
		templateUrl: 'templates/directives/authorSelector.html',
		link: function($scope) {
			$scope.selectedIndex = 0;
			$scope.list = [];
			if(!$scope.removeId)
				$scope.removeId = -1;

			console.log($scope.removeId);
			$rootScope.$watch('myAdminCommunities', function(val) {
				$scope.list = [$rootScope.loggedUser];
				if($rootScope.myAdminCommunities)
					$scope.list = $scope.list.concat($rootScope.myAdminCommunities);
				
				if($scope.author)
					$scope.setByAuthorID($scope.author);
				else
					$scope.setByIndex(0);

			}, true);
			
			$scope.selectAuthor = function(index) {
				console.log("Selected "+$scope.list[index]._id+" with index: ", index);
				// $scope.selectedIndex = index;

				// if we select user, return null, else return ID of selected community
				$scope.onChange()(index ? $scope.list[index]._id : null);
			};

			$scope.setByAuthorID = function(id) {
				console.log("SelectById: ", id);
				if(!id)
					return $scope.setByIndex(0);

				for(var i = 0; i < $scope.list.length; i++) {
					if($scope.list[i]._id == id) {
						return $scope.selectedIndex = i;
					}
				}
			};

			$scope.setByIndex = function(index) {
				return $scope.selectedIndex = index;
			};

			$scope.$watch('author', $scope.setByAuthorID);
		}
	};
}]);