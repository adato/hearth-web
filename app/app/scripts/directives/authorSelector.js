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
			selectedEntity: '=?author',
			authorId: '=',
			authorList: '=',
			remove: '=remove',
			ngDisabled: '=',
		},
		templateUrl: 'templates/directives/authorSelector.html',
		link: function($scope) {
			$scope.list = [];
			$scope.selected = {};
			$scope.selectedEntity = {};

			$scope.getIndexById = function(id) {
				for(var i = 0; i < $scope.list.length; i++) {
					if($scope.list[i]._id == id)
						return i;
				}
				return 0;
			};

			$scope.getByIndex = function(id) {
				if(!id)
					return $scope.list[0];

				for(var i = 0; i < $scope.list.length; i++)
					if($scope.list[i]._id == id)
						return $scope.list[i];
				return {};
			};

			$scope.buildAuthorList = function() {
				if(!$rootScope.loggedUser)
					return false;

				if($scope.authorList)
					return $scope.list = $scope.authorList;

				$scope.list = [$rootScope.loggedUser];
				if($rootScope.myAdminCommunities)
					for(var i = 0; i < $rootScope.myAdminCommunities.length; i++) {
						if($rootScope.myAdminCommunities[i]._id !== $scope.remove)
							$scope.list.push($rootScope.myAdminCommunities[i]);
					}

				var index = $scope.getIndexById($scope.authorId);
				$scope.selected._id = $scope.list[index]._id;
				$scope.selectedEntity = $scope.list[index];
			};

			$scope.onChange = function(id) {
				if(id === $rootScope.loggedUser._id)
					id = null;
				
				$scope.authorId = id;
				$scope.selectedEntity = $scope.getByIndex(id);
			};
			
			$scope.selectAuthor = function(id) {
				if(!id && $scope.list.length)
					id = $scope.list[0]._id;

				$scope.selected._id = id;
				$scope.selectedEntity = $scope.getByIndex(id);
			};


			$scope.$watch('authorId', $scope.selectAuthor);
			$scope.$watch('remove', $scope.buildAuthorList);
			$rootScope.$watch('myAdminCommunities', $scope.buildAuthorList, true);
			$scope.buildAuthorList();
		}
	};
}]);