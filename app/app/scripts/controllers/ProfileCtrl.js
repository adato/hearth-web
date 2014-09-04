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

		$scope.fetchUser = function () {

			User.get({user_id: $routeParams.id}, function(res) {
				$scope.info = res;
				$scope.loaded = true;
			}, function (res) {
				$scope.loaded = true;
			});
		};

		function refreshDataFeed() {
    		$scope.pagePath = $route.current.originalPath;
    		$scope.pageSegment = $route.current.$$route.segment;
		}

		$rootScope.$on('$routeChangeSuccess', refreshDataFeed);
		refreshDataFeed();

		$scope.fetchUser();
	}
]);