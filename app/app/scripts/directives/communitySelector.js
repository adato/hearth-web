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
		},
		templateUrl: 'templates/directives/communitySelector.html',
		link: function($scope, baseElement) {
        	$scope.myCommunities = [];
			$scope.list = {
				communities: $scope.communities
			};

			$rootScope.$watch("myCommunities", function(val) {
            	$scope.myCommunities = val;
			});

            $scope.$watch("list.communities", function(val) {
                console.log(val);
                $scope.communities = val;
            });
		}
	};
}]);