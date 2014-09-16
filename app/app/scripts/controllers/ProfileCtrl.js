'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ProfileCtrl', [
	'$scope', 'Auth', '$route', 'User', 'flash', 'Errors', '$routeParams', '$location', 'UsersService', '$rootScope', '$timeout', '$window', '$translate', '$analytics', '$q', 'ResponseErrors', 'ProfileProgress', 'Facebook', 'Karma',

	function($scope, Auth, $route, User, flash, Errors, $routeParams, $location, UsersService, $rootScope, $timeout, $window, $translate, $analytics, $q, ResponseErrors, ProfileProgress, Facebook, Karma) {
		$scope.loaded = false;
		$scope.info = false;
		
		$scope.isMine = function () {
			var _mineUser = ($rootScope.loggedUser) ? $rootScope.loggedUser._id === $routeParams.id: false;
			var _mineCommunity = ($rootScope.loggedCommunity) ? $rootScope.loggedCommunity._id == $routeParams.id: false;
			
			return _mineCommunity || _mineUser;
		};

		$scope.fetchUser = function () {

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

		$scope.refreshDataFeed = function() {
			$rootScope.subPageLoaded = false;
    		$scope.pagePath = $route.current.originalPath;
    		$scope.pageSegment = $route.current.$$route.segment;
		}

		$scope.refreshUser = function() {
			$scope.refreshDataFeed();
			$scope.fetchUser();
		};
		
		$scope.$on('$routeChangeSuccess', $scope.refreshUser);
		$scope.$on('initFinished', $scope.refreshUser);
		$rootScope.initFinished && $scope.refreshUser();
	}
]);