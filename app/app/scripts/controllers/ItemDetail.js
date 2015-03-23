'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemDetail
 * @description
 */

angular.module('hearth.controllers').controller('ItemDetail', [
	'$scope', '$routeParams', '$rootScope', 'OpenGraph', 'Post', '$timeout', 'PostReplies', 'Karma', 'UsersCommunitiesService',
	function($scope, $routeParams, $rootScope, OpenGraph, Post, $timeout, PostReplies, Karma, UsersCommunitiesService) {
		$scope.ad = false;
		$scope.adDeleted = false;
		$scope.loaded = false;
		$scope.isPrivate = false;
		$scope.profile = false;


		// init language
		$scope.postTypes = {
			User: {
				need: 'DOES_WISH',
				offer: 'DOES_GIVE'
			},
			Community: {
				need: 'WE_NEED',
				offer: 'WE_GIVE'
			}
		};

		$scope.replyLabel = {
			offer: 'WISH_GIFT',
			need: 'OFFER_GIFT'
		};

		$scope.replyCountTexts = {
			offer: 'PEOPLE_COUNT_WISH_PL',
			need: 'PEOPLE_COUNT_OFFER_PL'
		};

		$scope.loadReplies = function() {
			PostReplies.get({user_id: $routeParams.id}, function(data) {
				$scope.replies = data.replies;
			});
		};

		$scope.fillUserInfo = function(info) {
			$scope.profile = info;
			$scope.loaded = true;
		};

		// load post data
		$scope.load = function() {

			Post.get({postId: $routeParams.id}, function(data) {
				$scope.ad = data;
				
				if($rootScope.loggedUser._id)
					UsersCommunitiesService.loadProfileInfo(data.author, $scope.fillUserInfo);
				else
					$scope.loaded = true;

				// if there are post data, process them
				if(data.name) {
					var image = null;
					var title = data.author.name;

					if(data.attachments_attributes && data.attachments_attributes.length)
						image = data.attachments_attributes[0].large;
					

					if (data.title)
						title += " - " + data.title;
					OpenGraph.set(title, data.name || "", null, image);

					$scope.profile = data.author;
					$scope.isMine = $rootScope.isMine(data.owner_id);
					$scope.karma = Karma.count($scope.ad.author.up_votes, $scope.ad.author.down_votes);
					//$scope.page = { 'currentPageSegment': ($scope.isMine ? 'detail.replies' : 'detail.map') };
					$scope.initMap();

					$scope.isExpiringSoon = moment(data.valid_until).subtract(7, 'days').isBefore(new Date())
												&& moment(data.valid_until).isAfter(new Date());
					
					
					$timeout(function() {
						$scope.$broadcast('initMap');
						$scope.$broadcast('showMarkersOnMap');
					});

					$scope.isMine && $scope.loadReplies();
					$scope.postAddress = $rootScope.appUrl+'%23!/ad/'+$scope.ad._id;
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
		$scope.$on('updatedItem', $scope.load);
		$scope.$on('itemDeleted', $scope.removeAd);
		$scope.$on('initFinished', $scope.load);


		$rootScope.initFinished && $scope.load();
	}
]);
