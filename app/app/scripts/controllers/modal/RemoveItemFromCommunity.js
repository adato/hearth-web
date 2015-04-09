'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.RemoveItemFromCommunity
 * @description
 */

angular.module('hearth.controllers').controller('RemoveItemFromCommunity', [
	'$scope', '$rootScope', 'Notify', 'Post', '$timeout',
	function($scope, $rootScope, Notify, Post, $timeout) {
		var timeout = null;
		$scope.communities = {};
		$scope.communitiesCount = 0;
		$scope.sending = false;
		$scope.showErrors = false;
		$scope.message = '';
		$scope.showErrors = {
			message: false,
			communities: false,
		}

		$scope.showFinished = function() {

			$(".report-ad").slideToggle();
			timeout = $timeout(function() {
				$scope.closeThisDialog();
			}, 5000);
		};

		$scope.close = function() {
			$timeout.cancel(timeout);
			$scope.closeThisDialog();
		};

		$scope.getCheckedCommunities = function() {
			// if we have only one community to remove post from,
			// return it as a default community	
			if($scope.communitiesCount == 1)
				return [$scope.communityObj._id];

			var res = [];
			// walk throught all communities and pick checked IDs
			for(var id in $scope.communities)
				if($scope.communities[id]) res.push(id);

			return res;
		};

		$scope.validate = function(data) {
			var invalid = false;

			if($scope.reportForm.message.$invalid)
				invalid = $scope.showErrors.message = true;
			
			if(!data["ids[]"].length)
				invalid = $scope.showErrors.communities = true;

			return !invalid;
		};

		$scope.removeCommunities = function(item, ids) {
			item.admin_communities = $(item.admin_communities).not(ids).get();
			item.related_communities = item.related_communities.filter(function(item) {return !~ids.indexOf(item._id)});
		};

		$scope.sendRemoval = function() {
			var data = {
				postId: $scope.post._id,
				"ids[]": $scope.getCheckedCommunities(),
				message: encodeURIComponent($scope.message),
			};

			if($scope.sending || !$scope.validate(data))
				return false;

			$rootScope.globalLoading = true;
			$scope.sending = true;

			Post.communityRemove(data, function(res) {
				$scope.removeCommunities($scope.post, data["ids[]"]);
                
				$scope.sending = false;
                $rootScope.globalLoading = false;
                $scope.showFinished();
            }, function(err) {
                
				$scope.sending = false;
                $rootScope.globalLoading = false;
                Notify.addSingleTranslate('NOTIFY.POST_REMOVE_FROM_COMMUNITY_FAILED', Notify.T_ERROR,  '.notify-report-container');
            });
		};

		$scope.init = function() {
			$($rootScope.myAdminCommunities).each(function(index, community) {
				
				if(1+$scope.post.admin_communities.indexOf(community._id)) {

					$scope.communities[community._id] = false;
					$scope.communityObj = community;
				}
			});

			$scope.communitiesCount = Object.keys($scope.communities).length;
		};

		$scope.init();
	}
]);