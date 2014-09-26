'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityProfileCtrl', [
	'$scope', '$routeParams', '$rootScope', 'Community', '$route', 'CommunityApplicants',
	function($scope, $routeParams, $rootScope, Community, $route, CommunityApplicants) {
		$scope.loaded = false;
		$scope.info = {};

		$scope.isMine = function(res) {
			return $rootScope.loggedUser._id == res.admin;
		};

		$scope.amIAdmin = function(res) {
			return $rootScope.loggedUser._id == res.admin;
		};

		$scope.fetchCommunity = function() {

			if ($scope.info._id !== $routeParams.id) $scope.loaded = false;

			Community.get({ communityId: $routeParams.id }, function(res) {

				$scope.info = res;
				$scope.loaded = true;
				$scope.mine = $scope.isMine(res); // is community mine?
				$scope.managing = $scope.amIAdmin(res); // is community mine?

				$scope.$broadcast("communityTopPanelLoaded");
			}, function(res) {
				$scope.loaded = true;
			});
		};
		
		$scope.refreshDataFeed = function() {
			$rootScope.subPageLoaded = false;
			$scope.pagePath = $route.current.originalPath;
			$scope.pageSegment = $route.current.$$route.segment;
		};

		$scope.applyForCommunity = function() {

			CommunityApplicants.add({communityId: $scope.info._id}, function(res) {
				
				// flash message and refresh the community profile page
				alert("OK");
				$scope.init();
			}, function(err) {
				alert("There was en error while processing this request :-(");
			});
		};

		$scope.init = function() {
			$scope.refreshDataFeed();
			$scope.fetchCommunity();
		};

		$scope.$on('$routeChangeSuccess', $scope.init);
		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);