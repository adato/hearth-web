'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MarketCtrl
 * @description Market list controller, handler events from underlaying component
 */

angular.module('hearth.controllers').controller('MarketCtrl', [
	'$scope', 'Post', '$location', 'PostReplies', 'User',

	function($scope, Post, $location, PostReplies, User) {
		$scope.limit = 15;
		$scope.items = [];

		$scope.load = function() {
			var params = angular.extend(angular.copy($location.search()), {
				offset: $scope.items.length,
				limit: $scope.limit
			});

			Post.query(params, function(data) {
				$scope.items = params.offset > 0 ? $scope.items.concat(data) : data;
			});
		};

		$scope.$on('filterApply', function($event, filterData) {
			$location.search(filterData);
		});

		$scope.$on('filterSave', function($event, filterData) {
			User.edit({
				_id: $scope.user._id,
				filter: filterData
			});
		});

		$scope.$on('filterReset', function() {
			$location.search('');
			$scope.$broadcast('resetFilterData');

			if ($scope.user.filter) {
				User.edit({
					_id: $scope.user._id,
					filter: {}
				});
			}
		});

		$scope.$on('adCreated', function($event, data) {
			$scope.items.unshift(data);
		});
		$scope.$on('searchMap', function() {
			$scope.showMap = true;
		});
		$scope.$on('searchList', function() {
			$scope.showMap = false;
		});

		$scope.$on('sendReply', function($event, data) {
			PostReplies.add(data);
		});

		$scope.$on('report', function($event, data) {
			Post.spam(data);
		});

		$scope.$on('adSaved', function($event, data) {
			var phantomRecord, i;

			for (i = 0; i < $scope.items.length; i++) {
				if ($scope.items[i].isPhantom) {
					phantomRecord = $scope.items[i];
					break;
				}
			}
			if (phantomRecord) {
				phantomRecord = angular.extend(phantomRecord, data);
				phantomRecord.isPhantom = false;
				$scope.items[i] = phantomRecord;
			}
		});

		$scope.$on('$routeUpdate', function() {
			$scope.items = [];
			$scope.load();
		});

		$scope.$on('removeAd', function($event, id) {
			var i, item;

			for (i = 0; i < $scope.items.length; i++) {
				item = $scope.items[i];
				if (item._id === id) {
					$scope.items.splice(i, 1);
					break;
				}
			}
			Post.remove({
				postId: id
			});
		});

		$scope.$on('authorize', function() {
			$scope.load();
		});
		$scope.load();
	}
]);