'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MarketCtrl
 * @description Market list controller, handler events from underlaying component
 */

angular.module('hearth.controllers').controller('MarketCtrl', [
	'$scope', 'Post', '$location',

	function($scope, Post, $location) {
		$scope.limit = 15;
		$scope.items = [];
		
		$scope.load = function() {
			var params = $location.search();

			params = angular.extend(params, {
				offset: $scope.items.length,
				limit: $scope.limit
			});

			Post.query(params, function(data) {
				$scope.items = params.offset > 0 ? $scope.items.concat(data) : data;
			});
		};

		$scope.$on('filter', function($event, filterData) {
			$location.search(filterData);
		});

		$scope.$on('clearFilter', function() {
			$location.search('');
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

		$scope.load();

	}
]);