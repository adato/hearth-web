'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ProfileCtrl', [
	'$scope', 'Auth', '$route', 'User', 'flash', 'Errors', '$routeParams', '$location', 'UsersService', '$rootScope', '$timeout', '$window', '$translate', '$analytics', '$q', 'ResponseErrors', 'ProfileProgress', 'Facebook',

	function($scope, Auth, $route, User, flash, Errors, $routeParams, $location, UsersService, $rootScope, $timeout, $window, $translate, $analytics, $q, ResponseErrors, ProfileProgress, Facebook) {
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
				$scope.mine = $scope.isMine();
				$scope.loaded = true;

				$scope.$broadcast("profileTopPanelLoaded");
			}, function (res) {
				$scope.loaded = true;
			});
		};

		function refreshDataFeed() {
			$rootScope.subPageLoaded = false;
    		$scope.pagePath = $route.current.originalPath;
    		$scope.pageSegment = $route.current.$$route.segment;
		}

		refreshDataFeed();
		$rootScope.$on('$routeChangeSuccess', refreshDataFeed);

		$scope.$on('initFinished', $scope.fetchUser);
		if($rootScope.initFinished) {
			$scope.fetchUser();
		}
	}
]);