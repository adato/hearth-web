'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemDetail
 * @description
 */

angular.module('hearth.controllers').controller('ItemDetail', [
	'$scope', '$stateParams', '$rootScope', 'OpenGraph', 'Post', '$timeout', 'PostReplies', 'Karma', 'UsersCommunitiesService', '$filter',

	function($scope, $stateParams, $rootScope, OpenGraph, Post, $timeout, PostReplies, Karma, UsersCommunitiesService, $filter) {
		$scope.ad = false;
		$scope.adDeleted = false;
		$scope.loaded = false;
		$scope.isPrivate = false;
		$scope.profile = false;
		$scope.isMine = false;

		// init language
		$scope.postTypes = $$config.postTypes;
		$scope.replyLabel = $$config.replyLabels;
		$scope.replyCountTexts = $$config.replyCountTexts;

		$scope.deserializeReply = function(item) {
			if(item.from_community) {
				item.from_community.person = item.message.author;
				item.message.author = item.from_community;	
			}
			return item;
		};

		$scope.loadReplies = function() {
			PostReplies.get({user_id: $stateParams.id}, function(data) {
				$scope.replies = data.replies.filter($scope.deserializeReply);
			});
		};

		$scope.fillUserInfo = function(info) {
			$scope.profile = info;
			$scope.loaded = true;
		};

		// load post data
		$scope.load = function() {

			Post.get({postId: $stateParams.id}, function(data) {
				$scope.ad = data;
				
				if($rootScope.loggedUser._id && data.name)
					UsersCommunitiesService.loadProfileInfo(data.author, $scope.fillUserInfo);
				else
					$scope.loaded = true;

				// if there are post data, process them
				if(data.name) {
					var image = $rootScope.getSharingImage(data.attachments_attributes, data.author.avatar);
					var postType = $filter('translate')($scope.postTypes[data.author._type][data.type]);
					var title = 'Hearth.net: '+postType+' '+data.title+' ('+data.author.name+')';

					OpenGraph.set(title, data.name || "", null, image.original, image.size);

					$scope.profile = data.author;
					$scope.isMine = $rootScope.isMine(data.owner_id);
					$scope.karma = Karma.count($scope.ad.author.up_votes, $scope.ad.author.down_votes);
					//$scope.page = { 'currentPageSegment': ($scope.isMine ? 'detail.replies' : 'detail.map') };
					$scope.initMap();

					$scope.isExpiringSoon = !data.valid_until_unlimited && moment(data.valid_until).subtract(7, 'days').isBefore(new Date())
												&& moment(data.valid_until).isAfter(new Date());
					
					
					$timeout(function() {
						$scope.$broadcast('initMap');
						$scope.$broadcast('showMarkersOnMap');
					});

					$scope.isMine && $scope.loadReplies();
					$scope.postAddress = $rootScope.appUrl+'post/'+$scope.ad._id;
					$scope.isActive = $rootScope.isPostActive($scope.ad);
				}
			}, function(res) {
				$scope.loaded = true;
				$scope.ad = false;
			});
		};

		// fade out post and set him as deleted
		$scope.removeAd = function($event, item) {
			if(item._id != $scope.ad._id)
				return false;

			$("#item_container_"+item._id).fadeOut("slow", function() {
				$scope.adDeleted = true;
				$scope.$apply();
			});
		};

		$scope.initMap = function () {
			$timeout(function() {
				$scope.$broadcast('initMap');
				$scope.$broadcast('showMarkersOnMap');
			});
		}

		$scope.$watch('page.currentPageSegment', function (newval, oldval) {
			if (newval == 'detail.map') $scope.initMap();
		});

		$scope.$on('postCreated', $scope.load);
		$scope.$on('postUpdated', $scope.load);
		$scope.$on('itemDeleted', $scope.removeAd);
		$scope.$on('initFinished', $scope.load);


		$rootScope.initFinished && $scope.load();
	}
]);
