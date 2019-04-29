'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityDataFeedCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityDataFeedCtrl', [
	'$scope', '$stateParams', '$rootScope', 'Community', 'CommunityMembers', 'CommunityApplicants', 'Post', 'Notify', '$timeout', 'UserRatings', 'CommunityRatings', 'UniqueFilter', 'Activities', 'PostServices', 'ProfileUtils', '$log', 'UsersCommunitiesService', '$sce', 'PostScope',
	function($scope, $stateParams, $rootScope, Community, CommunityMembers, CommunityApplicants, Post, Notify, $timeout, UserRatings, CommunityRatings, UniqueFilter, Activities, PostServices, ProfileUtils, $log, UsersCommunitiesService, $sce, PostScope) {
		angular.extend($scope, PostServices);
		$scope.loadingData = false;

		const ACTIVITY_LIMIT = 10;
		$scope.showHeader = true;
		$scope.activityShow = false;
		$scope.activityLog = [];
		$scope.activityLogFetchRunning;
		$scope.view = { 
			expanded: false 
		}; // used for template action binding
		var activityLogComplete;
		// Count of all activities includes activities inside the groups
		var activityLogOffset = 0;

		var ItemFilter = new UniqueFilter();
		var inited = false;
		var loadServices = {
			'posts': loadCommunityPosts,
			'members': loadCommunityMember,
			'applications': loadCommunityApplications,
			'invite': loadCommunityInvite,
		};
		var templatePath = 'assets/components/post/posts/post.html';

		$scope.communityPostCount = {
			'active': 0,
			'inactive': 0
		};


		var postPageSize = 5;
		$scope.postPageOffset = 0;

		$scope.loadCommunityActivities = (done, config = {}) => {
			if (activityLogComplete || $scope.activityLogFetchRunning) return;
			$scope.activityLogFetchRunning = true;

			done = typeof done === 'function' ? done : angular.identity;
			
			var currentActivityLogOffset = 0;
			if (config && config.eventType == 'scroll') {
				currentActivityLogOffset = currentActivityLogOffset + activityLogOffset;
			}

			Community.getActivityLog({
				communityId: $stateParams.id,
				offset: currentActivityLogOffset,
				limit: ACTIVITY_LIMIT,
				filter: 'community_accepted_user,community_new_post,new_rating_received,new_rating',
				include_full: 'Post,Rating',
				groups: 'community_accepted_user'
			}).$promise.then(res => {
				// $scope.activityLogFetchRunning = false;
				$scope.activityShow = true;

				res.data.map(function(activity) {
					activity.text = Activities.getActivityTranslation(activity);
					return activity;
				});

				if (config && config.eventType == 'scroll') {
					$scope.activityLog.push(...res.data);
				} else {
					$scope.activityLog = res.data;
				}

				activityLogOffset += parseInt(res.headers('X-Pagination-Count'), 10);
				if (activityLogOffset === parseInt(res.headers('X-Pagination-Total'), 10) || res.data.length === 0) {
					activityLogComplete = true;
				}
				// done();
			}).catch(err => {
				// TODO: make better error report
				console.error('error getting activity log')
			}).finally(() => {
				$scope.activityLogFetchRunning = false;
				done()
			});
		};

		$scope.loadBottom = function() {
			$scope.loadingData = true;
			loadServices[$scope.pageSegment]($stateParams.id, processData, processDataErr);
		};

		$scope.openRatingReplyForm = function(rating) {
			if ($scope.data) $scope.data.forEach(function(item) {
				item.formOpened = false;
			});

			rating.formOpened = true;
		};

		function finishLoading(res) {
			$timeout(function() {
				$scope.subPageLoaded = true;

				if (!$scope.$parent)
					$scope.$parent = {};

				$scope.$parent.loaded = true;
			});

			if (res && res.length) {
				$scope.loadingData = false;
			}
		}

		function processData(res) {
			res = ItemFilter.filter(res);
			$scope.data = $scope.data.concat(res);
			finishLoading(res);
		}

		function processDataErr(res) {
			finishLoading([]);
		}


		function loadCommunityMember(id, doneErr) {
			var obj = {
				communityId: id,
				limit: 12,
				offset: $scope.data.length
			};

			CommunityMembers.query(obj, processData, doneErr);
		}

		function loadCommunityApplications(id, doneErr) {
			var obj = {
				communityId: id,
				limit: 12,
				offset: $scope.data.length
			};

			CommunityApplicants.query(obj, processData, doneErr);
		}

		// helper variables for getting post list
		var getPostsStatus = {
			running: false
		};

		var getPostsResult = {
			active: [],
			inactive: []
		};
		var getPostsQ = [];

		$scope.loadNext = function () {
			if (!getPostsResult.active.length) return; 
			$scope.postPageOffset = $scope.postPageOffset+1;
			loadCommunityPosts($scope.info._id);
		}

		function loadCommunityInvite(id) {
			console.log(id)
		}

		// load posts of community
		// render them same way as on marketplace, ie download & compile templates, make scope, inject it..
		function loadCommunityPosts(id) {
			var templateUrl = $sce.getTrustedResourceUrl(templatePath);

			
			// counter for template
			$scope.communityPostCount.active = 0;
			$scope.communityPostCount.inactive = 0;
 
			getPostsResult.active = [];
			getPostsResult.inactive = [];

			$scope.communityPostListActiveOptions = {
				getData: ProfileUtils.getPosts.bind(null, {
					params: {
						communityId: id,
						limit: postPageSize,
						offset: postPageSize * $scope.postPageOffset
					},
					resource: Community.getPosts,
					getPostsStatus: getPostsStatus,
					getPostsResult: getPostsResult,
					getPostsQ: getPostsQ,
					postCount: $scope.communityPostCount,
					active: true
				}),
				templateUrl: templateUrl,
				inactivateTags: true,
				cb: finishLoading,
			};

			$scope.communityPostListInactiveOptions = {
				getData: ProfileUtils.getPosts.bind(null, {
					params: {
						communityId: id
					},
					resource: Community.getPosts,
					getPostsStatus: getPostsStatus,
					getPostsResult: getPostsResult,
					getPostsQ: getPostsQ,
					postCount: $scope.communityPostCount
				}),
				disableLoading: true,
				inactivateTags: true,
				templateUrl: templateUrl,
			};

			//$rootScope.$emit('itemList.refresh')

		}


		$scope.refreshItemInfo = function($event, itemNew) {
			$scope.posts.data.forEach(function(item, key) {
				if (item._id === itemNew._id) {
					$scope.posts.data.splice(key, 1);
				}
			});
		};

		// =================================== Public Methods ====================================

		$scope.remove = function(item) {
			Post.remove({
				postId: item._id
			}, function(res) {

				$scope.$emit('postCreated', item._id); // refresh post list
				$scope.cancel(item);
			}, processDataErr);
		};

		$scope.removeMember = function(id) {
			if ($scope.sendingRemoveMember) return false;
			$scope.sendingRemoveMember = true;

			CommunityMembers.remove({
				communityId: $scope.info._id,
				memberId: id
			}, function(res) {
				$scope.sendingRemoveMember = false;
				Notify.addSingleTranslate('COMMUNITY.NOTIFY.SUCCESS_USER_KICKED', Notify.T_SUCCESS);
				$scope.init();
			}, function(res) {
				$scope.sendingRemoveMember = false;
			});
		};

		// only hide post .. may be used later for delete revert
		$scope.removeItemFromList = function($event, item) {
			$("#post_" + item._id).slideUp("slow", function() {});
		};

		function init() {
			ItemFilter.clear();
			$scope.loadingData = true;
			$scope.data = [];
			$scope.pageSegment = $stateParams.page || 'posts';
			var loadService = loadServices[$scope.pageSegment];
			$scope.debug && $log.log("Calling load service for segment ", $scope.pageSegment);
			loadService($stateParams.id, processData, processDataErr);

			// refresh after new post created
			if (!inited && ['posts', 'home'].indexOf($scope.pageSegment) > -1) {
				var reloadFn = function() {
					$scope.communityPostCount.active = 0;
					$scope.communityPostCount.inactive = 0;
					getPostsResult.active = [];
					getPostsResult.inactive = [];
					$scope.postPageOffset = 0;

					$rootScope.$emit('itemList.refresh');
					//loadService($stateParams.id, processData, processDataErr);
				}
				$scope.$on('postCreated', reloadFn);
				$scope.$on('postUpdated', reloadFn);

				// added event listeners - dont add them again
				inited = true;
			}
		}

		// will add new rating to data array
		$scope.addCommunityRating = function($event, item) {
			$scope.data.unshift(item);
			// $scope.flashRatingBackground(item);
		};

		$scope.$on('refreshSubpage', init);
		$scope.$on('communityRatingsAdded', $scope.addCommunityRating);
		$scope.$on('itemDeleted', $scope.removeItemFromList);
		init();
	}
]);
