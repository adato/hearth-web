'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MarketCtrl
 * @description Market list controller, handler events from underlaying component
 */

angular.module('hearth.controllers').controller('MarketCtrl', [
	'$scope', '$rootScope', 'Post', '$location', 'PostReplies', 'User', '$translate', '$timeout', 'Filter', 'Notify',

	function($scope, $rootScope, Post, $location, PostReplies, User, $translate, $timeout, Filter, Notify) {
		$scope.limit = 15;
		$scope.items = [];
		$scope.showMap = false;
		$scope.loading = false;
		$scope.keywordsActive = [];

		function refreshTags() {
			$scope.keywordsActive = Filter.getActiveTags();
		}

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
			$scope.topArrowText.bottom = $translate('TOTAL_COUNT', {
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

					$rootScope.$broadcast('postsLoaded');
				});
			}
		};

		function init() {

			refreshTags();

			$scope.$on('authorize', function() {
				$scope.load();
			});
			$scope.$watch('user', function(value) {
				if (value.loggedIn && !Filter.isSet()) {
					$scope.filter = value.filter;
					$location.search(value.filter || {});
				}
				$scope.load();
			});
		}

		$scope.$on('filterApplied', function($event, filterData) {
			$scope.user.filter = filterData;

			refreshTags();
			
			if ($scope.filter && $.isEmptyObject($location.search())) {
				return $location.search($scope.filter);
			}

			$scope.loading = false;
			$scope.items = [];
			$scope.load();
		});

		$scope.$on('filterReseted', function() {
			
			$scope.$broadcast('resetFilterData');

			$scope.loading = false;
			$scope.filter = {};
			$scope.user.filter = {};
			$scope.items = [];
			$scope.load();
		});

		$scope.$on('postUpdated', function($event, data) {
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
			$scope.loading = false;
			$scope.showMap = false;
			$scope.load();
		});

		$scope.$on('postCreated', function($event, post) {

			$scope.showMap = false;
			
			// hide him and show with some effect
			post.hidden = true;
			$scope.items.unshift(post);

			$timeout(function() {
				$(".post_"+post._id).slideDown(function() {
					post.hidden = false;
				});
			});
		});

		$scope.$on('sendReply', function($event, data) {
			PostReplies.add(data);
		});

		$scope.$on('itemDeleted', function($event, item) {
            $( ".post_"+item._id ).slideUp( "slow", function() {});
        });

		$scope.$on('$destroy', function() {
			$scope.topArrowText.top = '';
			$scope.topArrowText.bottom = '';
		});

		// ==== Global event fired when init process is finished
		$scope.$on('initFinished', init);
		if($rootScope.initFinished) {
			init();
			$scope.load();
		}
	}
]);