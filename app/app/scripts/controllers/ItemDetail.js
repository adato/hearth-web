'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ItemDetail
 * @description
 */

angular.module('hearth.controllers').controller('ItemDetail', [
	'$scope', '$routeParams', '$rootScope', 'OpenGraph', 'Post', '$translate',

	function($scope, $routeParams, $rootScope, OpenGraph, Post, $translate) {
		$scope.item = {};
		$scope.itemDeleted = false;
		$scope.show = false;
		$scope.loaded = false;
        var type = {
            user: {
                need: 'I_WISH',
                offer: 'I_GIVE'
            },
            community: {
                need: 'WE_NEED',
                offer: 'WE_GIVE'
            }
        };
        
                
		// load post item
		$scope.load = function() {

			Post.get({postId: $routeParams.id}, function(item) {
				var title = item.author.name;

				if (item.title)
					title += " - " + item.title;
				OpenGraph.set(title, item.name || "");

				$scope.item = item;
				$scope.profile = item.author;
				$scope.isMine = $scope.loggedUser && item.author._id === $scope.loggedUser._id;
				$scope.agreeTranslationData = {
					name: item.author.name
				};

                var url = window.location.href.replace(window.location.hash, ''),
                    typeText = $translate(item.community_id ? type.community[item.type] : type.user[item.type]);

                if (item) {
                    url += '%23!/ad/' + item._id;
                }

                angular.extend($scope, {
                    facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
                    gplus: 'https://plus.google.com/share?url=' + url,
                    twitter: 'https://twitter.com/share?url=' + url,
                    mail: 'mailto:?subject=' + typeText + ': ' + item.title + '&body=' + item.name
                });

				$scope.loaded = true;
				$scope.show = true;
			}, function() {
				$scope.show = true;
				$scope.item = false;
				$scope.loaded = true;
			});
		};

	    $scope.replyItem = function() {
	        $rootScope.replyItem($scope.item);
	    };

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