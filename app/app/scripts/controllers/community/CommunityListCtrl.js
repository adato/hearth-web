'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityListCtrl
 * @description 
 */
 
angular.module('hearth.controllers').controller('CommunityListCtrl', [
	'$scope', '$rootScope',
	function($scope, $rootScope) {
		$scope.myCommunities = null;
		$scope.randomCommunities = null;
		
		$scope.fetchMyCommunities = function() {
			
		};

		$scope.fetchRandomCommunities = function() {

			
		};

		$scope.init = function() {
			
			$scope.fetchMyCommunities();
			$scope.fetchRandomCommunities();
		};

		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);