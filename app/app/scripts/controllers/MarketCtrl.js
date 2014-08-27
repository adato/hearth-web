'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MarketCtrl
 * @description Market list controller, handler events from underlaying component
 */

angular.module('hearth.controllers').controller('MarketCtrl', [
	'$scope', 'Post', '$location', 'PostReplies', 'User', '$translate', '$timeout', 'Filter',

	function($scope, Post, $location, PostReplies, User, $translate, $timeout, Filter) {
		$scope.limit = 15;
		$scope.items = [];
		$scope.showMap = false;
		$scope.loading = false;
		$scope.keywordsActive = [];

		function init() {

			refreshTags();
		}

		function refreshTags() {
			$scope.keywordsActive = Filter.getActiveTags();
		}

		$scope.$on('$routeUpdate', refreshTags);

		$scope.addItemsToList = function(data, index) {
			if (data.data.length > index) {
				$scope.items.push(data.data[index]);

				return $timeout(function() {
					$scope.addItemsToList(data, index + 1);
				}, 10);
			}

			$scope.finishLoading(data);
		};

		$scope.finishLoading = function(data) {
			$scope.topArrowText.top = $translate('ads-has-been-read', {
				value: $scope.items.length
			});
			$scope.topArrowText.bottom = $translate('total-count', {
				value: data.total
			});

			$scope.loading = false;
		}

		$scope.load = function() {

			if ($scope.loading == true)
				return;

			$scope.loading = true;

			if ($scope.showMap === false) {
				var params = angular.extend(angular.copy($location.search()), {
					offset: $scope.items.length,
					limit: $scope.limit
				});

				if ( $.isArray(params.keywords)) {
					params.keywords = params.keywords.join(",");
				}

				Post.query(params, function(data) {
					if (params.offset > 0) {
						$scope.addItemsToList(data, 0);
					} else {
						$scope.items = data.data;
						$scope.finishLoading(data);
					}
				});
			}
		};

		$scope.$on('filterApply', function($event, filterData, save) {
			$location.search(filterData);
			if (save) {
				User.edit(angular.extend({
					_id: $scope.user._id,
					filter: filterData
				}));
				$scope.user.filter = filterData;
			}
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
			$scope.filter = {};
			$scope.user.filter = {};
			$scope.items = [];
			$scope.load();
		});

		$scope.$on('adCreated', function($event, data) {
			$scope.items.unshift(data);
		});
		$scope.$on('adUpdated', function($event, data) {
			var item, i;

			for (i = 0; i < $scope.items.length; i++) {
				item = $scope.items[i];
				if (data._id === item._id) {
					$scope.items[i] = $.extend(item, data);
					break;
				}
			}
		});

		$scope.$on('searchMap', function() {
			$scope.showMap = true;
			$timeout(function() {
				$scope.$broadcast('initMap');
			});
		});
		$scope.$on('searchList', function() {
			$scope.showMap = false;
			$scope.load();
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
			if ($scope.filter && $.isEmptyObject($location.search())) {
				$location.search($scope.filter);
				return;
			}
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
		$scope.$watch('user', function(value) {
			if (value.loggedIn) {
				$scope.filter = value.filter;
				$location.search(value.filter || {});
			}
			$scope.load();
		});

		$scope.$on('$destroy', function() {
			$scope.topArrowText.top = '';
			$scope.topArrowText.bottom = '';
		});

		init();
	}
]);