'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemDetail
 * @description
 */

angular.module('hearth.controllers').controller('ItemDetail', [
	'$scope', '$routeParams', '$rootScope', 'OpenGraph', 'Post', '$timeout', 'PostReplies', 'Karma',
	function($scope, $routeParams, $rootScope, OpenGraph, Post, $timeout, PostReplies, Karma) {
		$scope.ad = false;
		$scope.adDeleted = false;
		$scope.loaded = false;
		$scope.isPrivate = false;

		$scope.loadReplies = function() {
			PostReplies.get({user_id: $routeParams.id}, function(data) {
				$scope.replies = data.replies;
			});
		};

		// load post data
		$scope.load = function() {
			Post.get({postId: $routeParams.id}, function(data) {
				$scope.ad = data;
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
					$scope.page = { 'currentPageSegment': ($scope.isMine ? 'detail.replies' : 'detail.map') };
					$scope.initMap();
					
					$timeout(function() {
						$scope.$broadcast('initMap');
						$scope.$broadcast('showMarkersOnMap');
					});

					$scope.isMine && $scope.loadReplies();
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
		$scope.$on('itemDeleted', $scope.removeAd);
		$scope.$on('initFinished', $scope.load);

        $rootScope.initFinished && $scope.load();
	}
]);
