'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ProfileCtrl', [
	'$scope', '$route', 'User', '$routeParams', 'UsersService', '$rootScope', '$timeout', 'Karma',

	function($scope, $route, User, $routeParams, UsersService, $rootScope, $timeout, Karma) {
		$scope.loaded = false;
		$scope.info = false;
		
		$scope.isMine = function () {
			var _mineUser = ($rootScope.loggedUser) ? $rootScope.loggedUser._id === $routeParams.id: false;
			var _mineCommunity = ($rootScope.loggedCommunity) ? $rootScope.loggedCommunity._id == $routeParams.id: false;
			
			return _mineCommunity || _mineUser;
		};

		$scope.fetchUser = function () {
			$scope.loaded = false;

			User.get({user_id: $routeParams.id}, function(res) {
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
			}, function (res) {
				$scope.loaded = true;
			});
		};

		$scope.removeFollower = function(user_id) {

			UsersService.removeFollower(user_id, $rootScope.loggedUser._id);
		};
		
		$scope.addFollower = function(user_id) {
			UsersService.addFollower(user_id);
		};

		$scope.toggleFollow = function(user_id) {
			
			if($scope.info.is_followed) {
				$scope.removeFollower(user_id);
			} else {
				$scope.addFollower(user_id);
			}
			
			$scope.info.is_followed = !$scope.info.is_followed;
		}

		$scope.refreshDataFeed = function() {
			$rootScope.subPageLoaded = false;
    		$scope.pagePath = $route.current.originalPath;
    		$scope.pageSegment = $route.current.$$route.segment;
		};

		$scope.refreshUser = function() {
			$scope.refreshDataFeed();
			$scope.fetchUser();
		};
		
		$scope.$on('$routeChangeSuccess', $scope.refreshUser);
		$scope.$on('initFinished', $scope.refreshUser);
		$rootScope.initFinished && $scope.refreshUser();
	}
]);