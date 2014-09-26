'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityListCtrl
 * @description 
 */
 
angular.module('hearth.controllers').controller('CommunityListCtrl', [
	'$scope', '$rootScope', 'CommunityMemberships', 'Communities',
	function($scope, $rootScope, CommunityMemberships, Communities) {
		$scope.myCommunities = [];
		$scope.randomCommunities = [];
		
		$scope.fetchMyCommunities = function() {
			if(! $rootScope.loggedUser._id) return false;
			// get my communities
			CommunityMemberships.get({user_id: $rootScope.loggedUser._id},function(res) {
				$scope.myCommunities = res;
			});
		};

		$scope.fetchRandomCommunities = function() {
			Communities.random({}, function(res) {
				$scope.randomCommunities = res;
			});
		};

		$scope.init = function() {
			if($rootScope.loggedUser._id) {
				$scope.fetchMyCommunities();
			}
			$scope.fetchRandomCommunities();
		};

		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);