'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityProfileCtrl', [
	'$scope', '$routeParams', '$rootScope', 'Community',
	function($scope, $routeParams, $rootScope, Community) {
		
		$scope.fetchUser = function() {

			if ($scope.info._id !== $routeParams.id) {
				$scope.loaded = false;
			}

			User.get({
				user_id: $routeParams.id
			}, function(res) {
				$scope.info = res;
				if (res && res.avatar.normal) {
					$scope.info.avatarStyle = res.avatar.large;
				} else {
					$scope.info.avatarStyle = $$config.defaultUserImage;
				}

				$scope.info.karma = Karma.count(res.up_votes, res.down_votes);
				$scope.mine = $scope.isMine();
				$scope.loaded = true;

				$scope.$broadcast("profileTopPanelLoaded");
			}, function(res) {
				$scope.loaded = true;
			});
		};
		$scope.refreshDataFeed = function() {
			$rootScope.subPageLoaded = false;
			$scope.pagePath = $route.current.originalPath;
			$scope.pageSegment = $route.current.$$route.segment;
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