'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.MarketCtrl
 * @description Market list controller, handler events from underlaying component
 */

angular.module('hearth.controllers').controller('MarketCtrl', [
	'$scope', '$rootScope', 'Post', '$location', '$translate', '$timeout', 'Filter', 'Notify', 'UniqueFilter', '$templateCache', '$templateRequest', '$sce', '$compile', 'ItemServices',

	function($scope, $rootScope, Post, $location, $translate, $timeout, Filter, Notify, UniqueFilter, $templateCache, $templateRequest, $sce, $compile, ItemServices) {
		$scope.limit = 15;
		$scope.items = [];
		$scope.loaded = false;
		$scope.loading = false;
		$scope.keywordsActive = [];
		$scope.author = null;
		$scope.filterIsOn = false;
		var ItemFilter = new UniqueFilter();
		var templateFunction = null;
		var container = null;
		var templateUrl = $sce.getTrustedResourceUrl('templates/directives/item.html');

		function refreshTags() {
			$scope.keywordsActive = Filter.getActiveTags();
		}

		$scope.resetFilter = function() {
			ItemFilter.clear();
			Filter.reset();
			$scope.loaded = false;
		};

		$scope.toggleFilter = function() {
			$scope.$broadcast("filterOpen");
		};

		$scope.getPostScope = function(post) {
			
			var scope = $scope.$new(true);
            scope.keywords = $scope.keywordsActive; 
            scope.item = post;
            scope.toggleTag = Filter.toggleTag;
            scope.foundationColumnsClass = 'large-10';
			scope.delayedView = true;
			angular.extend(scope, ItemServices);

            // post address for social links
            scope.postAddress = $rootScope.appUrl+'post/'+post._id;
            scope.isActive = $rootScope.isPostActive(post);

            // is this my post? if so, show controll buttons and etc
            scope.mine = scope.item.owner_id === (($rootScope.user) ? $rootScope.user._id : null);

            scope.isExpiringSoon = !scope.item.valid_until_unlimited && moment(scope.item.valid_until).subtract(7, 'days').isBefore(new Date()) && moment(scope.item.valid_until).isAfter(new Date());
            return scope;
		};

		$scope.addItemsToList = function(data, index, done) {
			var posts = data.data;

			// console.timeEnd("Post built");
			if (posts.length > index) {
				var post = posts[index];
				// post.index = index+1; // index starting with 1
				
				// if(posts.length == post.index)
				// 	post.isLast = true;

				console.time("Single post ("+(index+1)+") built");
				$scope.items.push(post);

				templateFunction($scope.getPostScope(post), function(clone){
					// console.log(clone);
					$('#market-item-list').append(clone[0]);
					setTimeout(function() {
						// if(index < 4)
						// 	$('#post_'+scope.item._id).fadeIn();
						// else
							$('#post_'+post._id).slideDown();
					});
				});
	
				return $timeout(function() {
					console.timeEnd("Single post ("+(index+1)+") built");
					$scope.addItemsToList(data, index + 1, done);
				});
			}
			console.timeEnd("Posts pushed to array and built");
			done(data);
		};

		$scope.finishLoading = function(data, isLast) {
			$scope.topArrowText.top = $translate.instant('ads-has-been-read', {
				value: $scope.items.length
			});
			$scope.topArrowText.bottom = $translate.instant('TOTAL_COUNT', {
				value: data.total
			});

			console.time("Posts displayed with some effect");

			// fade out loading bar
			$(".loading").fadeOut('fast', function() {
				// show hidden posts and recount their height to show "show more" button

				console.timeEnd("Posts displayed with some effect");
				console.timeEnd("Market posts loaded and displayed");
				// finish loading and allow to show loading again
				
				$timeout(function() {
					if(!isLast)
						$scope.loading = false;
				});

				$(".loading").show();
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

			console.time("Market posts loaded and displayed");
			console.time("Market posts loaded from API");
			// load based on given params
			Post.query(params, function(data) {
				$scope.loaded = true;

				if(!data.data.length) {
					$scope.finishLoading(data.data, true);
					return;
				}

				console.timeEnd("Market posts loaded from API");
				if(data.data) {

					data.data = $scope.insertLastPostIfMissing(data.data);
					data.data = ItemFilter.filter(data.data);

				}
				console.time("Posts pushed to array and built");
				// iterativly add loaded data to the list and then call finishLoading
				$scope.addItemsToList(data, 0, $scope.finishLoading);
				
				
				$rootScope.$broadcast('postsLoaded');
			});
		};
		
		function init() {
			ItemFilter.clear();
			refreshTags();
			Filter.checkUserFilter();
			Filter.getCommonKeywords();

			$scope.filterIsOn = Filter.isSet();
		}

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

					templateFunction($scope.getPostScope(data), function(clone){
						$('#post_'+data._id).replaceWith(clone);
						
						setTimeout(function() {
							$('#post_'+data._id).slideDown();
						});
					});

					break;
				}
			}
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
			$rootScope.cacheInfoBox = {};
		});


	    $templateRequest(templateUrl).then(function(template) {
	    	templateFunction = $compile(template);

	    	setTimeout(function() {
	    		container = $('#market-item-list');

				init();
				$scope.load();
	    	});
	    });

	}
]);