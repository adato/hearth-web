'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityProfileCtrl', [
	'$scope', '$routeParams', '$rootScope', 'Community', '$route', 'CommunityApplicants', 'CommunityMembers', 'CommunityLeave', '$window',
	function($scope, $routeParams, $rootScope, Community, $route, CommunityApplicants, CommunityMembers, CommunityLeave, $window) {
		$scope.loaded = false;
		$scope.info = {};

		$scope.isMine = function(res) {
			return $rootScope.loggedUser._id == res.admin;
		};

		$scope.amIAdmin = function(res) {
			return $rootScope.loggedUser._id == res.admin;
		};

		$scope.fetchCommunity = function() {
			if(!$routeParams.id) return false;
			if ($scope.info._id !== $routeParams.id) $scope.loaded = false;

			Community.get({ communityId: $routeParams.id }, function(res) {

				$scope.info = res;
				$scope.loaded = true;
				$scope.mine = $scope.isMine(res); // is community mine?
				$scope.managing = $scope.amIAdmin(res); // is community mine?

				$scope.$broadcast("communityTopPanelLoaded");
			}, function(res) {
				$scope.loaded = true;
			});
		};
		
		$scope.refreshDataFeed = function() {
			$rootScope.subPageLoaded = false;
			$scope.pagePath = $route.current.originalPath;
			$scope.pageSegment = $route.current.$$route.segment;
		};

		$scope.applyForCommunity = function() {

			CommunityApplicants.add({communityId: $scope.info._id}, function(res) {
				
    			alert("FLASH MESSAGE");
				$scope.init();
			}, handleApiError);
		};

        $scope.rejectApplication = function(id)  {

        	CommunityApplicants.remove({communityId: $scope.info._id, applicantId: id}, function(res) {
    			alert("FLASH MESSAGE");
        		$scope.init();
        	}, handleApiError);
        };

        $scope.leaveCommunity = function() {
        	CommunityLeave.leave({community_id: $scope.info._id}, function(res) {

        		alert("FLASH MESSAGE");
        		$window.reload();
        		$rootScope.$broadcast("reloadCommunities");
        	}, function(res) {

        		alert("There was an error while processing this request.");
        	});
        }
        $scope.approveApplication = function(id) {

        	CommunityMembers.add({communityId: $scope.info._id, user_id: id}, function(res) {
    			alert("FLASH MESSAGE");
        		$scope.init();
        	}, handleApiError);
        };

        function handleApiError(res) {
    		alert("There was an error while processing this post.");
        }

		$scope.init = function() {
			$scope.refreshDataFeed();
			$scope.fetchCommunity();
		};

		$scope.$on('$routeChangeSuccess', $scope.init);
		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);