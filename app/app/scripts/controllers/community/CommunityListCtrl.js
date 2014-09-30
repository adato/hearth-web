'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityListCtrl
 * @description 
 */
 
angular.module('hearth.controllers').controller('CommunityListCtrl', [
	'$scope', '$rootScope', 'CommunityMemberships', 'Communities',
	function($scope, $rootScope, CommunityMemberships, Communities) {
		$scope.randomCommunities = [];
		// my communities are loaded already in BaseCtrl for top navigation

		$scope.fetchRandomCommunities = function() {


			Communities.random({}, function(res) {
				$scope.randomCommunities = res;
			});
		};

		$scope.init = function() {
			$scope.fetchRandomCommunities();
		};

		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);