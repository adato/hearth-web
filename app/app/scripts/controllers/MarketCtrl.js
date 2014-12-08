'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MarketCtrl
 * @description Market list controller, handler events from underlaying component
 */

angular.module('hearth.controllers').controller('MarketCtrl', [
	'$scope', '$rootScope', 'Post', '$location', 'User', '$translate', '$timeout', 'Filter', 'Notify',

	function($scope, $rootScope, Post, $location, User, $translate, $timeout, Filter, Notify) {
		$scope.limit = 15;
		$scope.items = [];
		$scope.loaded = false;
		$scope.showMap = false;
		$scope.loading = false;
		$scope.keywordsActive = [];
		$scope.filterIsOn = false;

		function refreshTags() {
			$scope.keywordsActive = Filter.getActiveTags();
		}

		$scope.resetFilter = function() {
			Filter.reset();
			$scope.loaded = false;
		};

		$scope.toggleFilter = function() {
			$rootScope.$broadcast("filterOpen");
		};

		$scope.addItemsToList = function(data, index) {
			if (data.data.length > index) {
				$scope.items.push(data.data[index]);

				return $timeout(function() {
					$scope.addItemsToList(data, index + 1);
				}, 10);
			}
			$scope.finishLoading(data);
		};

		/**
		 * Will go throught loaded and hidden posts and display them with some effect
		 */
		$scope.showHidden = function(done) {
			$timeout(function() {
				var timeout = 0;
				var items = $(".wish-list .post:hidden");
				var lastItemIndex = items.length - 1;

				items.each(function(index) {
					$(this).delay(timeout).fadeIn(500, function() {
						if(index == lastItemIndex)
							done();
					});
					timeout += 50;

				});
			});
		};

		$scope.finishLoading = function(data) {
			$scope.topArrowText.top = $translate('ads-has-been-read', {
				value: $scope.items.length
			});
			$scope.topArrowText.bottom = $translate('TOTAL_COUNT', {
				value: data.total
			});

			$scope.showHidden(function() {
				$scope.loading = false;
			});
		};

		$scope.load = function() {
			if ($scope.loading == true)
				return;
			$scope.loading = true;

			if (!$scope.showMap) {
				var params = angular.extend(angular.copy($location.search()), {
					offset: $scope.items.length,
					limit: $scope.limit
				});

				if ( $.isArray(params.keywords)) {
					params.keywords = params.keywords.join(",");
				}

				Post.query(params, function(data) {
					if (params.offset > 0) {
						// $scope.addItemsToList(data, 0);
						$scope.items = $scope.items.concat(data.data);
					} else {
						$scope.items = data.data;
					}
					$scope.finishLoading(data);
		
					$scope.loaded = true;
					$rootScope.$broadcast('postsLoaded');
				});
			}
		};
		
		function init() {

			refreshTags();
			Filter.checkUserFilter();
			$scope.filterIsOn = Filter.isSet();

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

		/**
		 * When applied filter - refresh post on marketplace
		 */
		function refreshPosts() {
			$scope.filterIsOn = Filter.isSet();
			refreshTags();

			$scope.loaded = false;
			$scope.loading = false;
			$scope.items = [];
			$scope.load();
		}

		$scope.$on('filterApplied', refreshPosts);
		$scope.$on('filterReseted', function() {

			$scope.filter = {};
			$scope.user.filter = {};
			refreshPosts();
		});

		$scope.$on('postUpdated', function($event, data) {
			var item, i;

			for (i = 0; i < $scope.items.length; i++) {
				item = $scope.items[i];
				if (data._id === item._id) {
					$scope.items[i] =  data;
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

		/**
		 * When item is deleted - slide up his post and remove 
		 * post class so we won't manipulate with him in future
		 */
		$scope.$on('itemDeleted', function($event, item) {
			$( ".post_"+item._id ).slideUp( "slow", function() {
				$(this).removeClass("post");
			});
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