'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MarketCtrl
 * @description Market list controller, handler events from underlaying component
 */

angular.module('hearth.controllers').controller('MarketCtrl', [
	'$scope', '$rootScope', 'Post', '$location', '$q', '$translate', '$timeout', 'Filter', 'UniqueFilter', '$templateCache', '$templateRequest', '$sce', '$compile', 'HearthCrowdfundingBanner', '$log', '$state', 'InfiniteScrollPagination', 'ScrollService', 'PostScope', 'MarketPostCount',
	function($scope, $rootScope, Post, $location, $q, $translate, $timeout, Filter, UniqueFilter, $templateCache, $templateRequest, $sce, $compile, HearthCrowdfundingBanner, $log, $state, InfiniteScrollPagination, ScrollService, PostScope, MarketPostCount) {

		var marketplaceInited = false;

		InfiniteScrollPagination.init();
		// expose function to check whether the first page is shown or not
		$scope.firstPageNotShown = InfiniteScrollPagination.firstPageNotShown;

		$scope.limit = MarketPostCount;
		$scope.items = [];
		$scope.loaded = false;
		$scope.loading = false;
		$scope.keywordsActive = [];
		$scope.author = null;
		$scope.filterIsOn = false;
		$scope.disableLazyLoad = true;

		var lFilter;
		var marketInited = $q.defer();
		var ItemFilter = new UniqueFilter();
		var templates = {};
		var itemTypes = ['post', 'banner'] //, 'community', 'user', 'conversation']; no more types needed for now
		var templateDir = 'assets/components/item/items/';

		if ($state.params.query) {
			$rootScope.searchQuery.query = $state.params.query;
		}
		if ($state.params.type) {
			$rootScope.searchQuery.type = $state.params.type;
		}

		function refreshTags() {
			$scope.keywordsActive = Filter.getActiveTags();
		}

		$scope.resetFilter = function() {
			Filter.reset();
		};

		function compileTemplate(scope, done) {
			var item = scope.item;
			if (!item._type || !templates[item._type.toLowerCase()]) {
				Rollbar.error("HEARTH: No template found for this content", item);
				done('No template found for this content', '');
				return false;
			}

			templates[item._type.toLowerCase()](scope, done);
		}

		function addItemsToList(container, data, index, done) {
			var posts = data.data;

			// console.timeEnd("Post built");
			if (posts.length > index) {
				var post = posts[index];
				$scope.debug && console.time("Single post (" + (index) + ") built");
				$scope.items.push(post);

				var postScope = PostScope.getPostScope(post, $scope);
				return compileTemplate(postScope, function(clone) {
					clone[0].style.display = 'block';
					container.append(clone[0]);

					// Add pagination marker.
					if (index % MarketPostCount === 0) {
						var marker = $compile('<div pagination-marker="' + (InfiniteScrollPagination.getPageAndIncrementBottom()) + '"></div>')(postScope);
						marker.insertBefore(clone);
					}

					// Check params for ScrollService.MARKETPLACE_SCROLL_TO_PARAM and if found a matching id with current post, scrollTo it.
					// Timeout for the check must be set long enough for the slidedown to take its full effect.
					$timeout(function() {
						if ($location.search()[ScrollService.MARKETPLACE_SCROLL_TO_PARAM] === post._id) ScrollService.scrollToElement('#post_' + $location.search()[ScrollService.MARKETPLACE_SCROLL_TO_PARAM], false, 90);
					}, 600);

					$scope.debug && console.timeEnd("Single post (" + (index) + ") built");

					// Start next recursion cycle.
					addItemsToList(container, data, index + 1, done);

				});
			}
			$scope.debug && console.timeEnd("Posts pushed to array and built");
			done(data);
		};

		function finishLoading(data, isLast) {
			$scope.topArrowText.top = $translate.instant('ads-has-been-read', {
				value: $scope.items.length
			});
			$scope.topArrowText.bottom = $translate.instant('TOTAL_COUNT', {
				value: data.total
			});

			$scope.debug && console.timeEnd("Market posts loaded and displayed");
			// finish loading and allow to show loading again

			$timeout(function() {
				$scope.disableLazyLoad = false;
				if (!isLast) $scope.loading = false;
			});
		};

		// As temporary fix of issue #1010, this will retrieve newly added post from cache
		// and try if it in array of posts, if not, insert it, if yes delete it from cache
		function insertLastPostIfMissing(data) {
			var newPost = $rootScope.getPostIfMissing();

			// if there is not new post, dont do anything
			if (!newPost) return data;

			// go throught post array and if there is new post already
			// dont add him again
			for (var i = 0; i < data.length; i++) {
				if (data[i]._id == newPost._id) return data;
			}

			// if there is not, add him to the top
			data.unshift(newPost);
			return data;
		};

		$scope.toggleFilter = function() {
			$scope.$broadcast("filterOpen");
		};

		$scope.retrievePosts = function(params) {
			var paramObject = JSON.parse(JSON.stringify(params));
			if (paramObject.page) delete paramObject.page;

			// params.type = "community,user,post";
			// params.query = "*";
			paramObject.type = itemTypes.join(',');
			Post.query(paramObject, function(data) {
				$scope.loaded = true;
				$(".loading").hide();

				if (!data.data.length) return finishLoading(data.data, true);

				$scope.debug && console.timeEnd("Market posts loaded from API");
				if (data.data) {
					data.data = insertLastPostIfMissing(data.data);
					data.data = ItemFilter.filter(data.data);
					data.data = HearthCrowdfundingBanner.decorateMarketplace(data.data);
				}
				$scope.debug && console.time("Posts pushed to array and built");
				// iterativly add loaded data to the list and then call finishLoading
				addItemsToList($('#market-item-list'), data, 0, finishLoading.bind($scope));
				$rootScope.$emit('postsLoaded');
			}, function(err) {
				// error handler
				$scope.loaded = true;
				$(".loading").hide();
			});
		};

		/**
		 * This will load new posts to marketplace
		 */
		$scope.load = function() {
			$(".loading").show();


			// load only if map is not shown
			// load only once in a time
			if ($scope.loading) return;
			$scope.loading = true;

			// show message if requested to do so by url param
			$scope.infoMessageToShow;
			if ($state.params.showMessage) $scope.infoMessageToShow = $state.params.showMessage;

			// load posts
			var params = angular.extend(angular.copy($location.search()), {
				offset: $scope.items.length,
				limit: MarketPostCount
			});
			if ($location.search().page) {
				if (marketplaceInited) {
					params.offset = $scope.items.length + MarketPostCount * InfiniteScrollPagination.getPageBottom() - MarketPostCount;
				} else {
					InfiniteScrollPagination.marketplaceInit();

					params.offset = MarketPostCount * InfiniteScrollPagination.getPageBottom() - MarketPostCount;
					marketplaceInited = true;
				}
			}

			refreshTags();
			// if there are keywords, add them to search
			if ($.isArray(params.keywords)) {
				params.keywords = params.keywords.join(",");
			}

			$scope.debug && console.time("Market posts loaded and displayed");
			$scope.debug && console.time("Market posts loaded from API");

			if ($scope.debug) $log.debug('Loading content');
			marketInited.promise.then($scope.retrievePosts.bind($scope, params));
			// load based on given params
		};

		/**
		 * When applied filter - refresh post on marketplace
		 */
		$scope.refreshPosts = function() {
			$scope.filterIsOn = Filter.isSet();
			ItemFilter.clear();
			$scope.disableLazyLoad = true;
			$scope.loaded = false;
			$scope.loading = false;
			$scope.items = [];

			$('#market-item-list').html('');

			InfiniteScrollPagination.init();

			$scope.load();
		}

		$scope.$on('filterApplied', $scope.refreshPosts);

		$scope.$on('postUpdated', function($event, data) {
			var item, i;

			for (i = 0; i < $scope.items.length; i++) {
				if (data._id === $scope.items[i]._id) {
					$scope.items[i] = data;
					var post = PostScope.getPostScope(angular.copy(data), $scope);

					compileTemplate(post, function(clone) {
						$('#post_' + data._id).replaceWith(clone);

						setTimeout(function() {
							$('#post_' + data._id).slideDown();
						});
					});

					break;
				}
			}
		});

		$scope.$on('postCreated', function($event, post) {

			// hide him and show with some effect
			post.hidden = true;
			$scope.items.unshift(post);

			compileTemplate(PostScope.getPostScope(post, $scope), function(clone) {
				$('#market-item-list').prepend(clone);

				setTimeout(function() {
					$('#post_' + post._id).slideDown();
				});
			});
		});

		/**
		 * When item is deleted - slide up his post and remove
		 * post class so we won't manipulate with him in future
		 */
		$scope.$on('itemDeleted', function($event, item) {
			$("#post_" + item._id).slideUp("slow", function() {
				$(this).removeClass("post");
			});
		});

		$scope.$on('$destroy', function() {
			$scope.topArrowText.top = '';
			$scope.topArrowText.bottom = '';
			$rootScope.cacheInfoBox = {};
			$scope.debug && $log.debug('Destroy marketCtrl finished');
			// we do not want infinit scroll running on other pages than marketplace
			InfiniteScrollPagination.unbindScroll();

		});

		function init() {
			$scope.debug && $log.debug('Initialisation of marketCtrl started');
			async.each(itemTypes, function(type, done) {
				var tplUrl = $sce.getTrustedResourceUrl(templateDir + type + '.html');
				$scope.debug && $log.debug('Compiling template for ', type);

				$templateRequest(tplUrl).then(function(template) {
					templates[type] = $compile(template);
					done();
				});

			}, function(err, res) {
				if (Filter.isSaved()) Filter.applySaved();

				$scope.filterIsOn = Filter.isSet();
				marketInited.resolve();
				$scope.debug && $log.debug('Initialisation of marketCtrl almost finished');
				if (err) {
					$scope.debug && $log.error('There was an error during compilation process: ', err);
				}
				$scope.load();
			});
		};

		init();
	}
]);