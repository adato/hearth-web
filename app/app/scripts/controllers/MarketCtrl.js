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

		$scope.addItemsToList = function(data, index, done) {
			var posts = data.data;

			// console.timeEnd("Post built");
			if (posts.length > index) {
				posts[index].index = index+1; // index starting with 1
				
				if(posts.length == posts[index].index)
					posts[index].isLast = true;

				// console.time("Single post ("+(index+1)+") built");
				$scope.items.push(posts[index]);

				return $timeout(function() {
					// console.timeEnd("Single post ("+(index+1)+") built");
					$scope.addItemsToList(data, index + 1, done);
				});
			}
			// console.timeEnd("Posts pushed to array and built");
			done(data);
		};

		$scope.finishLoading = function(data) {
			$scope.topArrowText.top = $translate.instant('ads-has-been-read', {
				value: $scope.items.length
			});
			$scope.topArrowText.bottom = $translate.instant('TOTAL_COUNT', {
				value: data.total
			});

			// console.time("Posts displayed with some effect");

			// fade out loading bar
			$(".loading").fadeOut('fast', function() {
				// show hidden posts and recount their height to show "show more" button

				$scope.$broadcast("showHiddenPosts", function(index) {

					// console.timeEnd("Posts displayed with some effect");
					// console.timeEnd("Market posts loaded and displayed");
					// finish loading and allow to show loading again
					$scope.loading = false;
					$(".loading").show();
				});
			});
		};

		// As temporary fix of issue #1010, this will retrieve newly added post from cache
		// and try if it in array of posts, if not, insert it, if yes delete it from cache
		$scope.insertLastPostIfMissing = function(data) {
			var newPost = $rootScope.getPostIfMissing();

			// if there is not new post, dont do anything
			if(!newPost)
				return data;

			// go throught post array and if there is new post already
			// dont add him again
			for(var i = 0;i < data.length; i++) {
				if(data[i]._id == newPost._id)
					return data;
			}

			// if there is not, add him to the top
			data.unshift(newPost);
			return data;
		};

		/**
		 * This will load new posts to marketplace
		 */
		$scope.load = function() {
			// load only once in a time
			if ($scope.loading) return;
			$scope.loading = true;

			// load only if map is not shown
			if (!$scope.showMap) {
				var params = angular.extend(angular.copy($location.search()), {
					offset: $scope.items.length,
					limit: $scope.limit
				});

				// if there are keywords, add them to search
				if ( $.isArray(params.keywords)) {
					params.keywords = params.keywords.join(",");
				}

				// console.time("Market posts loaded and displayed");
				// console.time("Market posts loaded from API");
				// load based on given params
				Post.query(params, function(data) {
					$scope.loaded = true;
					// console.timeEnd("Market posts loaded from API");
					if(data.data)
						data.data = $scope.insertLastPostIfMissing(data.data);
					
					// console.time("Posts pushed to array and built");
					// iterativly add loaded data to the list and then call finishLoading
					$scope.addItemsToList(data, 0, $scope.finishLoading);
					$rootScope.$broadcast('postsLoaded');
				});
			}
		};
		
		function init() {

			refreshTags();
			Filter.checkUserFilter();
			Filter.getCommonKeywords();

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
				$("#post_"+post._id).slideDown(function() {
					post.hidden = false;
				});
			});
		});

		/**
		 * When item is deleted - slide up his post and remove 
		 * post class so we won't manipulate with him in future
		 */
		$scope.$on('itemDeleted', function($event, item) {
			$( "#post_"+item._id ).slideUp( "slow", function() {
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