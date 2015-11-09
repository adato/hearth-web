'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MarketCtrl
 * @description Market list controller, handler events from underlaying component
 */

angular.module('hearth.controllers').controller('MarketCtrl', [
	'$scope', '$rootScope', 'Post', '$filter', '$location', '$q', '$translate', '$timeout', 'Filter', 'Notify', 'UniqueFilter', '$templateCache', '$templateRequest', '$sce', '$compile', 'ItemServices', 'Karma', '$stateParams',
	function($scope, $rootScope, Post, $filter, $location, $q, $translate, $timeout, Filter, Notify, UniqueFilter, $templateCache, $templateRequest, $sce, $compile, ItemServices, Karma, $stateParams) {
		$scope.limit = 15;
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
		var itemTypes = ['post', 'community', 'user', 'conversation'];
		var templateDir = 'templates/directives/items/';

		if ($stateParams.query) {
			$rootScope.searchQuery.query = $stateParams.query;
		}
		if ($stateParams.type) {
			$rootScope.searchQuery.type = $stateParams.type;
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

		function getPostScope(post) {
			var author = post;

			if (post._type == 'Post')
				author = post.author;

			var scope = $scope.$new(true);
			scope.keywords = $scope.keywordsActive;
			scope.item = post;
			scope.toggleTag = Filter.toggleTag;
			scope.foundationColumnsClass = 'large-10';
			scope.showSharing = false;
			scope.delayedView = true;
			angular.extend(scope, ItemServices);

			scope.item.text_short = $filter('ellipsis')(scope.item.text, 270, true);

			// post address for social links
			scope.postAddress = $rootScope.appUrl + 'post/' + post._id;
			scope.isActive = $rootScope.isPostActive(post);

			// is this my post? if so, show controll buttons and etc
			scope.mine = scope.item.owner_id === (($rootScope.user) ? $rootScope.user._id : null);

			scope.isExpiringSoon = !scope.item.valid_until_unlimited && moment(scope.item.valid_until).subtract(7, 'days').isBefore(new Date()) && moment(scope.item.valid_until).isAfter(new Date());
			return scope;
		};

		function addItemsToList(container, data, index, done) {
			var posts = data.data;

			// console.timeEnd("Post built");
			if (posts.length > index) {
				var post = posts[index];

				$scope.debug && console.time("Single post (" + (index) + ") built");
				$scope.items.push(post);

				return compileTemplate(getPostScope(post), function(clone) {
					container.append(clone[0]);

					return $timeout(function() {
						$('#post_' + post._id).slideDown();

						$scope.debug && console.timeEnd("Single post (" + (index) + ") built");
						addItemsToList(container, data, index + 1, done);
					});
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

			$scope.debug && console.time("Posts displayed with some effect");

			$scope.debug && console.timeEnd("Posts displayed with some effect");
			$scope.debug && console.timeEnd("Market posts loaded and displayed");
			// finish loading and allow to show loading again

			$timeout(function() {
				$scope.disableLazyLoad = false;
				if (!isLast)
					$scope.loading = false;
			});
		};

		// As temporary fix of issue #1010, this will retrieve newly added post from cache
		// and try if it in array of posts, if not, insert it, if yes delete it from cache
		function insertLastPostIfMissing(data) {
			var newPost = $rootScope.getPostIfMissing();

			// if there is not new post, dont do anything
			if (!newPost)
				return data;

			// go throught post array and if there is new post already
			// dont add him again
			for (var i = 0; i < data.length; i++) {
				if (data[i]._id == newPost._id)
					return data;
			}

			// if there is not, add him to the top
			data.unshift(newPost);
			return data;
		};

		$scope.toggleFilter = function() {
			$scope.$broadcast("filterOpen");
		};

		$scope.retrievePosts = function(params) {
			// params.type = "community,user,post";
			// params.query = "*";
			Post.query(params, function(data) {
				$scope.loaded = true;
				$(".loading").hide();

				if (!data.data.length) {
					return finishLoading(data.data, true);
				}

				$scope.debug && console.timeEnd("Market posts loaded from API");
				if (data.data) {

					data.data = insertLastPostIfMissing(data.data);
					data.data = ItemFilter.filter(data.data);
				}
				$scope.debug && console.time("Posts pushed to array and built");
				// iterativly add loaded data to the list and then call finishLoading
				addItemsToList($('#market-item-list'), data, 0, finishLoading.bind($scope));
				$rootScope.$broadcast('postsLoaded');
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

			var params = angular.extend(angular.copy($location.search()), {
				offset: $scope.items.length,
				limit: $scope.limit
			});

			refreshTags();
			// if there are keywords, add them to search
			if ($.isArray(params.keywords)) {
				params.keywords = params.keywords.join(",");
			}

			$scope.debug && console.time("Market posts loaded and displayed");
			$scope.debug && console.time("Market posts loaded from API");

			if ($scope.debug) console.log('Loading content');
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
			$scope.load();
		}

		$scope.$on('filterApplied', $scope.refreshPosts);

		$scope.$on('postUpdated', function($event, data) {
			var item, i;

			for (i = 0; i < $scope.items.length; i++) {
				if (data._id === $scope.items[i]._id) {
					$scope.items[i] = data;
					var post = getPostScope(angular.copy(data));

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

			compileTemplate(getPostScope(post), function(clone) {
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
		});

		function init() {
			async.each(itemTypes, function(type, done) {
				var tplUrl = $sce.getTrustedResourceUrl(templateDir + type + '.html');
				if ($scope.debug) console.log('Compiling template for ', type);

				$templateRequest(tplUrl).then(function(template) {
					templates[type] = $compile(template);
					done();
				});

			}, function(err, res) {
				$scope.filterIsOn = Filter.isSet();
				marketInited.resolve();
				$scope.load();
			});
		};

		init();
	}
]);