'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MarketCtrl
 * @description Market list controller, handler events from underlaying component
 */

angular.module('hearth.controllers').controller('MarketCtrl', [
	'$scope', '$rootScope', 'Post', '$filter', '$location', '$translate', '$timeout', 'Filter', 'Notify', 'UniqueFilter', '$templateCache', '$templateRequest', '$sce', '$compile', 'ItemServices', 'Karma',

	function($scope, $rootScope, Post, $filter, $location, $translate, $timeout, Filter, Notify, UniqueFilter, $templateCache, $templateRequest, $sce, $compile, ItemServices, Karma) {
		$scope.debug = false; // measure and show time spent in post fetching and showing (false = disabled)
		$scope.limit = 15;
		$scope.items = [];
		$scope.loaded = false;
		$scope.loading = false;
		$scope.marketInitFinished = false;
		$scope.keywordsActive = [];
		$scope.author = null;
		$scope.filterIsOn = false;
		var ItemFilter = new UniqueFilter();
		var templateFunction = null;
		var templateUrl = $sce.getTrustedResourceUrl('templates/directives/item.html');

		function refreshTags() {
			$scope.keywordsActive = Filter.getActiveTags();
		}

		$scope.resetFilter = function() {
			$scope.$broadcast('filterReset');
		};

		$scope.toggleFilter = function() {
			$scope.$broadcast("filterOpen");
		};

	 	function getPostScope(post) {
			
			var scope = $scope.$new(true);
            scope.keywords = $scope.keywordsActive; 
            scope.item = post;
            scope.toggleTag = Filter.toggleTag;
            scope.foundationColumnsClass = 'large-10';
			scope.delayedView = true;
			angular.extend(scope, ItemServices);

			scope.item.name_short = $filter('ellipsis')(scope.item.name, 270, true);

            // post address for social links
            scope.postAddress = $rootScope.appUrl+'post/'+post._id;
            scope.isActive = $rootScope.isPostActive(post);
            scope.item.karma = Karma.count(post.author.up_votes, post.author.down_votes)+'%';

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
				
				$scope.debug && console.time("Single post ("+(index)+") built");
				$scope.items.push(post);

				return templateFunction(getPostScope(post), function(clone){
					container.append(clone[0]);
	
					return $timeout(function() {
						$('#post_'+post._id).slideDown();
						
						$scope.debug && console.timeEnd("Single post ("+(index)+") built");
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
				if(!isLast)
					$scope.loading = false;
			});
		};

		// As temporary fix of issue #1010, this will retrieve newly added post from cache
		// and try if it in array of posts, if not, insert it, if yes delete it from cache
		function insertLastPostIfMissing(data) {
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
			$(".loading").show();
			
			// load only if map is not shown
			// load only once in a time
			if ($scope.showMap || $scope.loading) return;
			$scope.loading = true;

			var params = angular.extend(angular.copy($location.search()), {
				offset: $scope.items.length,
				limit: $scope.limit
			});

			// if there are keywords, add them to search
			if ( $.isArray(params.keywords)) {
				params.keywords = params.keywords.join(",");
			}

			$scope.debug && console.time("Market posts loaded and displayed");
			$scope.debug && console.time("Market posts loaded from API");
			// load based on given params
			Post.query(params, function(data) {
				$scope.loaded = true;
				$(".loading").hide();

				if(!data.data.length) {
					finishLoading(data.data, true);
					return;
				}

				$scope.debug && console.timeEnd("Market posts loaded from API");
				if(data.data) {

					data.data = insertLastPostIfMissing(data.data);
					data.data = ItemFilter.filter(data.data);

				}
				$scope.debug && console.time("Posts pushed to array and built");
				// iterativly add loaded data to the list and then call finishLoading
				addItemsToList($('#market-item-list'), data, 0, finishLoading);
				
				$rootScope.$broadcast('postsLoaded');
			});
		};

		/**
		 * When applied filter - refresh post on marketplace
		 */
		function refreshPosts() {
			$scope.filterIsOn = Filter.isSet();
			refreshTags();
			ItemFilter.clear();
			
			$scope.loaded = false;
			$scope.loading = false;
			$scope.items = [];
			$('#market-item-list').html('');
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
				if (data._id === $scope.items[i]._id) {
					$scope.items[i] = data;
					var post = getPostScope(angular.copy(data));

					templateFunction(post, function(clone){
						$('#post_'+data._id).replaceWith(clone);
						
						$timeout(function() {
							$('#post_'+data._id).slideDown();
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

			templateFunction(getPostScope(post), function(clone){
				$('#market-item-list').prepend(clone);
				
				$timeout(function() {
					$('#post_'+post._id).slideDown();
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
			$rootScope.cacheInfoBox = {};
		});

	    $templateRequest(templateUrl).then(function(template) {
	    	templateFunction = $compile(template);

			$scope.filterIsOn = Filter.isSet();
			$scope.marketInitFinished = true;
			// $scope.load();
	    });
	}
]);