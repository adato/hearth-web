'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ProfileDataFeedCtrl', [
	'$scope', '$timeout', '$rootScope', '$stateParams', 'Followers', 'Friends', 'Followees', 'User', 'CommunityMemberships', 'UserRatings', 'CommunityRatings', 'UsersActivityLog', 'Fulltext', 'Post', 'UniqueFilter', 'Activities', 'ItemServices', 'UserBookmarks', 'UsersCommunitiesService', '$templateRequest', '$sce', '$compile', 'PostScope', 'MarketPostCount',

	function($scope, $timeout, $rootScope, $stateParams, Followers, Friends, Followees, User, CommunityMemberships, UserRatings, CommunityRatings, UsersActivityLog, Fulltext, Post, UniqueFilter, Activities, ItemServices, UserBookmarks, UsersCommunitiesService, $templateRequest, $sce, $compile, PostScope, MarketPostCount) {
		angular.extend($scope, ItemServices);
		var loadServices = {
				'home': loadUserHome,
				'posts': loadUserPosts,
				'replies': loadUserReplies,
				'communities': loadCommunities,
				'given-ratings': loadGivenRatings,
				'received-ratings': loadReceivedRatings,
				'following': loadFollowees,
				'followers': loadFollowers,
				'friends': loadFriends,
				'bookmarks': loadBookmarks,
				'activities': UsersActivityLog.get
			},
			params = {
				user_id: $stateParams.id,
			};
		$scope.postTypes = $$config.postTypes;
		$scope.data = [];
		$scope.loadingData = false;

		$scope.userPostCount = {
			'active': 0,
			'inactive': 0
		};
		$scope.userBookmarkCount = 0; // default zero counters

		var ItemFilter = new UniqueFilter();
		var selectedAuthor = false;
		var inited = false;
		$scope.subPageLoaded = false;

		var templatePath = 'assets/components/item/items/post.html';

		$scope.paginate = function(params) {
			params.offset = $scope.data.length;
			return params;
		};

		$scope.addPagination = function(params) {
			if (params.limit) return params;

			params.offset = $scope.data.length;
			params.limit = MarketPostCount;
			return params;
		};

		$scope.loadBottom = function() {
			$scope.loadingData = true;

			loadServices[$scope.pageSegment]($scope.paginate(params), processData, processDataErr);
		};

		$scope.openRatingReplyForm = function(rating) {
			if ($scope.data) $scope.data.forEach(function(item) {
				item.formOpened = false;
			});

			rating.formOpened = true;
		};

		function loadFriends(params, done, doneErr) {
			params.related = "user";
			$scope.addPagination(params);

			Friends.query(params, done, doneErr);
		}

		function loadGivenRatings(params, done, doneErr) {
			$scope.addPagination(params);
			UserRatings.given(params, done, doneErr);
		}

		function loadReceivedRatings(params, done, doneErr) {
			$scope.addPagination(params);
			$scope.loadedRatingPosts = false;
			$scope.ratingPosts = [];

			params.offset = $scope.data.length;
			params.limit = 10;
			UserRatings.received(params, function(err, res) {
				done(err, res);
				$rootScope.receivedRepliesAfterLoadHandler($scope.data, $scope);
			}, doneErr);

			$scope.$watch('rating.current_community_id', function(val) {
				if (val === selectedAuthor && $scope.loadedRatingPosts) return;
				selectedAuthor = val;

				if (!$rootScope.isMine(params.user_id)) {
					$scope.rating.post_id = null;
					processRelevantPosts(params, val);
				}
			});

			var removeListener = $scope.$on('$routeChangeStart', function() {
				$scope.closeUserRatingForm();
				removeListener();
			});
		};

		function processRelevantPosts(params, val) {
			var configUserPossible = {
				userId: params.user_id,
				current_community_id: val
			}
			var configUser = {
				userId: params.user_id
			}
			var configLoggedUser = {
				userId: $rootScope.loggedUser._id
			}
			var configCommunity = {
				communityId: val,
				not_related: true
			}

			$scope.loadingRatingPosts = true;

			UserRatings.possiblePosts(val ? configUserPossible : configUser, function(res, headers) {
				var posts = UsersCommunitiesService.alterPossiblePosts(res, headers);

				$scope.ratingPosts = posts;

				var ratingActivePosts = [];

				if (val) {
					UserRatings.activePosts(configUser, function(res) {
						angular.forEach(res.data, function(post) {
							ratingActivePosts.push(post);
						});
					});

					CommunityRatings.activePosts(configCommunity, function(res) {
						angular.forEach(res.data, function(post) {
							ratingActivePosts.push(post);
						});
					});
				} else {
					UserRatings.activePosts(configUser, function(res) {
						angular.forEach(res.data, function(post) {
							ratingActivePosts.push(post);
						});
					});

					UserRatings.activePosts(configLoggedUser, function(res) {
						angular.forEach(res.data, function(post) {
							ratingActivePosts.push(post);
						});
					});
				}

				$scope.ratingActivePosts = ratingActivePosts;
				$scope.loadedRatingPosts = true;
				$scope.loadingRatingPosts = false;
			}, function(res) {
				$scope.loadedRatingPosts = true;
				$scope.loadingRatingPosts = false;
			});
		}

		function loadFollowees(params, done, doneErr) {
			$scope.addPagination(params);

			params.related = "user";
			Followees.query(params, done, doneErr);
		}

		function loadFollowers(params, done, doneErr) {
			$scope.addPagination(params);
			params.related = "user";
			Followers.query(params, done, doneErr);
		}

		function loadCommunities(params, done, doneErr) {
			$scope.addPagination(params);
			CommunityMemberships.query(params, done, doneErr);
		}

		function loadBookmarks(params, done, doneErr) {
			var templateUrl = $sce.getTrustedResourceUrl(templatePath);
			var compiledTemplate;

			$scope.userBookmarkCount = 0;

			$scope.addPagination(params);
			params.user_id = undefined;

			$templateRequest(templateUrl).then(function(template) {
				var compiledTemplate = $compile(template);

				// fetch posts
				UserBookmarks.query(params, function(res) {
					$scope.postsBookmarked = [];

					res.forEach(function(item) {
						$scope.userBookmarkCount++;
						pushPost('.profile-common .ads-listing', item, compiledTemplate);
					});

					finishLoading();
				}, doneErr);
			});
		}

		function loadUserReplies(params, done, doneErr) {
			$scope.addPagination(params);
			User.getReplies(params, function(res) {
				done(res.replies);
			}, doneErr);
		}

		function pushPost(containerPath, post, compiledTemplate) {
			var scope = PostScope.getPostScope(post, $scope);
			scope.inactivateTags = true;
			compiledTemplate(scope, function(clone) {
				// doesnt work when not delayed
				$timeout(function() {
					$(containerPath).append(clone[0]);
					$timeout(function() {
						$('#post_' + post._id).show();
					});
				}, 100);
			});
		}

		// load posts of user
		// render them same way as on marketplace, ie download & compile templates, make scope, inject it..
		function loadUserPosts(params, done, doneErr) {
			var templateUrl = $sce.getTrustedResourceUrl(templatePath);
			var compiledTemplate;

			// counter for template
			$scope.userPostCount = {
				'active': 0,
				'inactive': 0
			};

			$templateRequest(templateUrl).then(function(template) {
				var compiledTemplate = $compile(template);

				// fetch posts
				User.getPosts(params, function(res) {
					res.data.forEach(function(item) {
						if ($rootScope.isPostActive(item)) {
							$scope.userPostCount.active++;
							pushPost('#profile-ads-listing-active', item, compiledTemplate);
						} else {
							$scope.userPostCount.inactive++;
							pushPost('#profile-ads-listing-inactive', item, compiledTemplate);
						}
					});
					finishLoading();
				}, doneErr);
			});
		}

		$scope.refreshItemInfo = function($event, itemNew) {
			// remove inactive posts
			$scope.posts.data.forEach(function(item, key) {
				if (item._id === itemNew._id) {
					$scope.posts.data.splice(key, 1);
				}
			});
		};

		function loadUserHome(params) {
			params.limit = 5;
			params.offset = 0;

			async.parallel([
				function(done) {
					UserRatings.received(params, function(res) {
						$scope.receivedRatings = res;
						done(null);
					}, done);
				},
				function(done) {
					UsersActivityLog.get(params, function(res) {
						if (res && typeof res.map === 'function') {
							res.map(function(activity) {
								activity.text = Activities.getActivityTranslation(activity);
								return activity;
							});
						}
						$scope.activityLog = res;
						done(null);
					}, done);
				},
				function(done) {
					params.state = 'active';

					User.getPosts(params, function(res) {
						$scope.posts = res;
						done(null);
					}, done);
				}
			], finishLoading);

			$scope.$on('postUpdated', $scope.refreshItemInfo);
		}

		$scope.cancelEdit = function() {
			init();
		};

		$scope.close = function() {
			$scope.close();
		};

		function finishLoading(res) {
			if (res && res.length)
				$scope.loadingData = false;

			$scope.subPageLoaded = true;
			if (!$scope.$parent)
				$scope.$parent = {};
			$scope.$parent.loaded = true;
			$rootScope.$emit("subPageLoaded");
		}

		function processData(res) {
			res = ItemFilter.filter(res);

			$scope.data = $scope.data.concat(res);
			finishLoading(res);
		}

		function processDataErr(res) {
			finishLoading([]);
		}

		function init(e) {
			$scope.pageSegment = $stateParams.page || 'home';
			if (!loadServices[$scope.pageSegment]) return;

			$scope.subPageLoaded = false;
			$scope.loadingData = true;

			loadServices[$scope.pageSegment](params, processData, processDataErr);

			var timeoutReloadFunction = function() {
				return $timeout(function() {
					$scope.loadingData = false;
					$scope.subPageLoaded = false;
					$scope.refreshUser(true);
					loadServices[$scope.pageSegment](params, processData, processDataErr)
				}, 800);
			}

			// refresh after new post created
			if (!inited) {
				if ($scope.pageSegment == 'profile' || $scope.pageSegment == 'profile.posts' || $scope.pageSegment == 'posts') {
					$scope.$on('postCreated', timeoutReloadFunction);
					$scope.$on('postUpdated', timeoutReloadFunction);
				};

				if ($scope.pageSegment == 'profile.bookmarks' || $scope.pageSegment == 'bookmarks') {
					$scope.$on('postUnbookmarked', timeoutReloadFunction);
				}
				// added event listeners - dont add them again
				inited = true;
			}
		}

		// only hide post .. may be used later for delete revert
		$scope.removeItemFromList = function($event, item) {
			$("#post_" + item._id).slideUp("slow", function() {});
			$scope.$emit("profileRefreshUserNoSubpage");
		};

		// will add new rating to data array
		$scope.addUserRating = function($event, item) {
			$scope.data.unshift(item);
			$scope.flashRatingBackground(item);
		};

		$scope.$on('userRatingsAdded', $scope.addUserRating);
		$scope.$on('itemDeleted', $scope.removeItemFromList);
		$scope.$on('profileTopPanelLoaded', init);
		init();
	}
]);