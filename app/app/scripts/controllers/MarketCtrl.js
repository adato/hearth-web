'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MarketCtrl
 * @description
 */

angular.module('hearth.controllers').controller('MarketCtrl', [
	'$scope', 'Post', '$location',

	function($scope, Post, $location) {

		$scope.$on('filter', function($event, filterData) {
			$location.search(filterData);
		});

		$scope.$on('clearFilter', function() {
			$location.search('');
		});

		$scope.$on('adCreated', function($event, data) {
			$scope.items.unshift(data);
		});
		$scope.$on('searchMap', function($event) {
			$location.path('/map')
		});
		$scope.$on('searchList', function($event) {
			$location.path('/')
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
			Post.query($location.search(), function(data) {
				$scope.items = data;
			});
		});

		Post.get(function(data) {
			$scope.items = data;
		});
	}
]);