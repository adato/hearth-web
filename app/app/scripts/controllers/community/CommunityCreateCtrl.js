'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityCreateCtrl
 * @description 
 */

angular.module('hearth.controllers').controller('CommunityCreateCtrl', [
	'$scope', '$window', '$routeParams', 'Community',
	function($scope, $window, $routeParams, Community) {
		$scope.communityUsers = [];
		$scope.defaultCommunity = {
			name: '',
			locations: [{name:''}],
			description: '',
			restrictions: '',
		};
		$scope.showError = {
			location: false,
			name: false,
			about: false,
			restrictions: false,
		};
		$scope.community = {};

		$scope.fillDefaultCommunity = function() {
			
			$scope.community = angular.copy($scope.defaultCommunity);
			$scope.loaded = true;
		};

		$scope.loadCommunity = function(id) {

			Community.get({communityId: id}, function(res) {
				console.log(res);
				$scope.community = res;
				$scope.loaded = true;
			});
		};

		$scope.getCommunityId = function() {
			return $routeParams.id;
		};

		$scope.save = function() {

			console.log("Saving: ", $scope.community);

		};


		$scope.init = function() {

			if($scope.getCommunityId()) {
				$scope.loadCommunity($scope.getCommunityId());
			} else {
				$scope.fillDefaultCommunity();
			}
		};

		$scope.init();
	}
]);