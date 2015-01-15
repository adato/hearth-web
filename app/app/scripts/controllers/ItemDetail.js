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
		$scope.itemDeleted = false;
		$scope.loaded = false;

		$scope.loadReplies = function() {
			PostReplies.get({user_id: $routeParams.id}, function(data) {
				$scope.replies = data.replies;
			});
		};

		// load post data
		$scope.load = function() {
			Post.get({postId: $routeParams.id}, function(data) {
				var title = data.author.name;

				if (data.title)
					title += " - " + data.title;
				OpenGraph.set(title, data.name || "");

				$scope.ad = data;
				$scope.profile = data.author;
				$scope.isMine = $scope.loggedUser && data.author._id === $scope.loggedUser._id;
				$scope.ad.author.karma = Karma.count($scope.ad.author.up_votes, $scope.ad.author.down_votes);
				$scope.page = { 'currentPageSegment': ($scope.isMine ? 'detail.replies' : 'detail.map') };
				$scope.initMap();
				
				console.log($scope.ad);

				$timeout(function() {
					$scope.$broadcast('initMap');
					$scope.$broadcast('showMarkersOnMap');
				});

				if($scope.isMine) {
					$scope.loadReplies();
				}

				$scope.loaded = true;
			}, function() {
				$scope.loaded = true;
				$scope.ad = false;
			});
		};

		// fade out post and set him as deleted
		$scope.removeAd = function($event, item) {

			$("#post_"+item._id).fadeOut("slow", function() {
				$scope.itemDeleted = true;
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

// 'use strict';

// /**
//  * @ngdoc controller
//  * @name hearth.controllers.ItemDetail
//  * @description
//  */

// angular.module('hearth.controllers').controller('ItemDetail', [
// 	'$scope', '$routeParams', '$rootScope', 'OpenGraph', 'Post',

// 	function($scope, $routeParams, $rootScope, OpenGraph, Post) {
// 		$scope.item = {};
// 		$scope.itemDeleted = false;
// 		$scope.loaded = false;
// 		$scope.loaded = false;

// 		// load post data
// 		$scope.load = function() {

// 			Post.get({postId: $routeParams.id}, function(data) {
// 				var title = data.author.name;

// 				if (data.title)
// 					title += " - " + data.title;
// 				OpenGraph.set(title, data.name || "");

// 				$scope.item = data;
// 				$scope.profile = data.author;
// 				$scope.mine = data.author._id === (($rootScope.user) ? $rootScope.user._id : null);

// 				$scope.agreeTranslationData = {
// 					name: data.author.name
// 				};

// 				$scope.loaded = true;
// 				$scope.loaded = true;
// 			}, function() {
// 				$scope.loaded = true;
// 				$scope.item = false;
// 				$scope.loaded = true;
// 			});
// 		};

// 		// fade out post and set him as deleted
// 		$scope.removeAd = function($event, item) {
// 			if($scope.item._id == item._id) {
// 				$(".post-detail .post").fadeOut("slow", function() {
// 					$scope.itemDeleted = true;
// 					$scope.$apply();
// 				});
// 			}
// 		};

// 		$scope.replyItem = function() {
//             $rootScope.replyItem($scope.item);
//         };

// 		$scope.$on('postCreated', $scope.load);
// 		$scope.$on('itemDeleted', $scope.removeAd);
// 		$scope.$on('initFinished', $scope.load);
//         $rootScope.initFinished && $scope.load();

// 	}

// ]);