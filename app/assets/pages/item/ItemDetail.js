'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemDetail
 * @description
 */

angular.module('hearth.controllers').controller('ItemDetail', [
	'$scope', '$stateParams', '$state', '$rootScope', 'OpenGraph', 'Post', 'PostUtils', '$timeout', 'PostReplies', 'Karma', 'UsersCommunitiesService', '$filter', 'IsEmpty', 'ProfileUtils', 'Bubble', 'ItemAux', 'PageTitle', '$translate',
	function($scope, $stateParams, $state, $rootScope, OpenGraph, Post, PostUtils, $timeout, PostReplies, Karma, UsersCommunitiesService, $filter, IsEmpty, ProfileUtils, Bubble, ItemAux, PageTitle, $translate) {
		$scope.item = false;
		$scope.itemDeleted = false;
		$scope.loaded = false;
		$scope.isPrivate = false;
		$scope.profile = false;
		$scope.isMine = false;
		$scope.isEmpty = IsEmpty;
		$scope.removeReminder = Bubble.removeReminder;
		$scope.ItemAux = ItemAux;

		// init language
    $scope.postTypes = $$config.postTypes;
		$scope.replyLabel = $$config.replyLabels;
		$scope.replyCountTexts = $$config.replyCountTexts;

		$scope.deserializeReply = function(item) {
			if (item.from_community) {
				item.from_community.person = item.message.author;
				item.message.author = item.from_community;
			}
			return item;
		};

		$scope.loadReplies = function() {
			PostReplies.get({
				user_id: $stateParams.id
			}, function(data) {
				$scope.replies = data.replies.filter($scope.deserializeReply);
			});
		};

		$scope.fillUserInfo = function(info) {
			info = ProfileUtils.single.copyMottoIfNecessary(info);
			$scope.profile = info;
			$scope.loaded = true;
		};

		// load post data
		$scope.load = function() {
			Post.get({
				postId: $stateParams.id
			}, function(data) {
				$scope.item = data;

				$scope.setTitle(data);
				if ($rootScope.loggedUser._id && data.text)
					UsersCommunitiesService.loadProfileInfo(data.author, $scope.fillUserInfo);
				else
					$scope.loaded = true;

				// if there are post data, process them
				if (data.text) {
					var image = $rootScope.getSharingImage(data.attachments_attributes, data.author.avatar);
          $scope.postTypeCode = PostUtils.getPostTypeCode(data.author._type, data.type, data.exact_type);
					var postType = $filter('translate')($scope.postTypeCode);
					var title = 'Hearth.net: ' + postType + ' ' + data.title + ' (' + data.author.name + ')';

					OpenGraph.set(title, data.text || "", null, image.large, image.size);

					$scope.profile = data.author;
					$scope.isMine = $rootScope.isMine(data.owner_id);
					$scope.karma = Karma.count($scope.item.author.up_votes, $scope.item.author.down_votes);
					//$scope.page = { 'currentPageSegment': ($scope.isMine ? 'detail.replies' : 'detail.map') };
					$scope.initMap();

					$scope.isExpiringSoon = !data.valid_until == 'unlimited' && moment(data.valid_until).subtract(7, 'days').isBefore(new Date()) && moment(data.valid_until).isAfter(new Date());


					$timeout(function() {
						$scope.$broadcast('initMap');
						$scope.$broadcast('showMarkersOnMap');
					});

					$scope.isMine && $scope.loadReplies();
					$scope.postAddress = $rootScope.appUrl + 'post/' + $scope.item._id;
					$scope.isActive = $rootScope.isPostActive($scope.item);
				}
			}, function(res) {
        $scope.setTitle(res);
				$scope.loaded = true;
				$scope.item = false;
			});
		};

		// fade out post and set him as deleted
		$scope.removeAd = function($event, item) {
			if (item._id != $scope.item._id)
				return false;

			$("#item_container_" + item._id).fadeOut("slow", function() {
				$scope.itemDeleted = true;
				if (!$scope.$$phase) $scope.$apply();
			});
		};

		$scope.setTitle = function(data) {
      if (data && data.status === 404) {
        PageTitle.setTranslate("POST_NOT_FOUND", "");
        return;
      }
      if (data && data.state === "expired") {
        PageTitle.setTranslate("POST_HAS_ALREADY_EXPIRED", "");
        return;
      }
      if (data && data.state === "suspended") {
        PageTitle.setTranslate("POST_WAS_SUSPENDED", "");
        return;
      }

      // Post found
			var author = ($scope.item.author ? $scope.item.author._type : 'User');
			var title = $translate.instant(PostUtils.getPostTypeCode(author, $scope.item.type, $scope.item.exact_type)) + ' ' + $scope.item.title;
			PageTitle.setTranslate('', title);
		};

		$scope.initMap = function() {
			$timeout(function() {
				$scope.$broadcast('initMap');
				$scope.$broadcast('showMarkersOnMap');
			});
		};

		$scope.$watch('page.currentPageSegment', function(newval, oldval) {
			if (newval == 'detail.map') $scope.initMap();
		});

		$scope.$on('postCreated', $scope.load);
		$scope.$on('postUpdated', $scope.load);
		$scope.$on('itemDeleted', $scope.removeAd);
		$scope.$on('initFinished', $scope.load);


		$rootScope.initFinished && $scope.load();
	}
]);
