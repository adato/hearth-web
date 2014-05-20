'use strict';

angular.module('hearth.controllers').controller('CommunityListCtrl', [
	'$scope', 'CommunityService', 'FulltextService', 'UsersCommunitiesService',
	function($scope, CommunityService, FulltextService, UsersCommunitiesService) {
		$scope.query = null;
		$scope.view = null;
		$scope.fetchCommunities = function() {
			var searchParams, service;
			searchParams = {
				offset: $scope.offset,
				limit: $scope.limit,
				type: 'community'
			};
			service = CommunityService;
			if ($scope.query) {
				service = FulltextService;
				searchParams.query = $scope.query;
			}
			if ($scope.isView('my')) {
				service = UsersCommunitiesService;
				searchParams.userId = $scope.loggedUser._id;
			}
			return service.query(searchParams).then(function(data) {
				$scope.lastQueryReturnedCount = data.length;
				return data.forEach(function(item) {
					if ($scope.isView('my')) {
						item = item.userId;
					}
					return $scope.items.push(item);
				});
			});
		};
		$scope.$on('search', function() {
			return $scope.fetchCommunities();
		});
		$scope.loadMoreAds = function() {
			if ($scope.lastQueryReturnedCount > 0 && !$scope.isView('my')) {
				$scope.offset = $scope.offset + $scope.limit;
				return $scope.$broadcast('search');
			}
		};
		$scope.refreshView = function() {
			var _ref;
			$scope.lastQueryReturnedCount = 0;
			$scope.offset = 0;
			$scope.limit = 15;
			$scope.items = [];
			if ((_ref = $scope.view) === 'all' || _ref === 'my') {
				return $scope.$broadcast('search');
			}
		};
		$scope.setView = function(view) {
			$scope.view = view;
			return $scope.refreshView();
		};
		$scope.isView = function(view) {
			return view === $scope.view;
		};
		$scope.init = function() {
			if (!$scope.view) {
				return $scope.setView('all');
			} else {
				return $scope.refreshView();
			}
		};
		return $scope.init();
	}
]);