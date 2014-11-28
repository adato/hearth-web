'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemDetail
 * @description
 */

angular.module('hearth.controllers').controller('ItemDetail', [
	'$scope', '$routeParams', '$rootScope', 'OpenGraph', 'Post',

	function($scope, $routeParams, $rootScope, OpenGraph, Post) {
		$scope.item = {};
		$scope.itemDeleted = false;
		$scope.show = false;
		$scope.loaded = false;

		// load post data
		$scope.load = function() {

			Post.get({postId: $routeParams.id}, function(data) {
				var title = data.author.name;

				if (data.title)
					title += " - " + data.title;
				OpenGraph.set(title, data.name || "");

				$scope.item = data;
				$scope.profile = data.author;
				$scope.isMine = $scope.loggedUser && data.author._id === $scope.loggedUser._id;
				$scope.agreeTranslationData = {
					name: data.author.name
				};

				$scope.loaded = true;
				$scope.show = true;
			}, function() {
				$scope.show = true;
				$scope.item = false;
				$scope.loaded = true;
			});
		};

		// fade out post and set him as deleted
		$scope.removeAd = function($event, item) {
			if($scope.item._id == item._id) {
				$(".post-detail .post").fadeOut("slow", function() {
					$scope.itemDeleted = true;
					$scope.$apply();
				});
			}
		};

		$scope.$on('postCreated', $scope.load);
		$scope.$on('itemDeleted', $scope.removeAd);
		$scope.$on('initFinished', $scope.load);
        $rootScope.initFinished && $scope.load();

	}

]);