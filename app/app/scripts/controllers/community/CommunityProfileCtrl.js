'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityProfileCtrl', [
	'$scope', '$routeParams', '$rootScope', 'Community', '$route', 'CommunityApplicants', 'CommunityMembers', 'CommunityLeave', '$window', 'Notify', 'UnauthReload',
	function($scope, $routeParams, $rootScope, Community, $route, CommunityApplicants, CommunityMembers, CommunityLeave, $window, Notify, UnauthReload) {
		$scope.loaded = false;
		$scope.info = false;
		$scope.loadingCounter = 0; // subpage will load only when there is no other request for top panel data
		$scope.sendingApplication = false;

		$scope.isMine = function(res) {
			return $rootScope.loggedUser._id == res.admin;
		};

		$scope.amIAdmin = function(res) {
			return $rootScope.loggedUser._id == res.admin;
		};

		$scope.fetchCommunity = function() {
			if(!$routeParams.id) return false;

			// if we load profile of another user (there are different IDs) scroll to top
			if ($scope.info._id !== $routeParams.id) {
				$rootScope.top(0, 1);
				$scope.loaded = false;
			}

			$scope.loadingCounter++;
			Community.get({_id: $routeParams.id }, function(res) {

				$scope.loadingCounter--;
				$scope.info = res;
				// $scope.loaded = true;
				$scope.mine = $scope.isMine(res); // is community mine?
				$scope.managing = $scope.amIAdmin(res); // is community mine?

				if(!$scope.loadingCounter) {
					$rootScope.communityLoaded = true;	
					$scope.$broadcast("communityTopPanelLoaded");
				}

			}, function(res) {

				$scope.loadingCounter--;
				$scope.loaded = true;
				$scope.info = false;
				$scope.mine = false;
				$scope.managing = false;

			});
		};
		
		$scope.refreshDataFeed = function() {
			$rootScope.subPageLoaded = false;
			$scope.pagePath = $route.current.originalPath;
			if($route.current.$$route)
				$scope.pageSegment = $route.current.$$route.segment;
		};

		$scope.applyForCommunity = function() {
			if($scope.sendingApplication) return false;
			$scope.sendingApplication = true;

			CommunityApplicants.add({communityId: $scope.info._id}, function(res) {
				$scope.init();
				Notify.addSingleTranslate('NOTIFY.COMMUNITY_APPLY_SUCCESS', Notify.T_SUCCESS);
				$scope.sendingApplication = false;
			}, function() {
				Notify.addSingleTranslate('NOTIFY.COMMUNITY_APPLY_FAILED', Notify.T_ERROR);
				$scope.sendingApplication = false;
			});
		};

        $scope.rejectApplication = function(id)  {

        	CommunityApplicants.remove({communityId: $scope.info._id, applicantId: id}, function(res) {
        		$scope.init();
				Notify.addSingleTranslate('NOTIFY.COMMUNITY_REJECT_SUCCESS', Notify.T_SUCCESS);
        	}, function() {
				Notify.addSingleTranslate('NOTIFY.COMMUNITY_REJECT_FAILED', Notify.T_ERROR);
        	});
        };

        $scope.leaveCommunity = function() {
        	CommunityLeave.leave({community_id: $scope.info._id}, function(res) {

				Notify.addSingleTranslate('NOTIFY.COMMUNITY_LEAVE_SUCCESS', Notify.T_SUCCESS);
        		$scope.init();
        		$rootScope.$broadcast("reloadCommunities");
        	}, function(res) {

				Notify.addSingleTranslate('NOTIFY.COMMUNITY_LEAVE_FAILED', Notify.T_ERROR);
        	});
        };

        $scope.approveApplication = function(id) {

        	CommunityMembers.add({communityId: $scope.info._id, user_id: id}, function(res) {

				Notify.addSingleTranslate('NOTIFY.COMMUNITY_APPROVE_APPLICATION_SUCCESS', Notify.T_SUCCESS);
        		$scope.init();
        	}, function() {
				Notify.addSingleTranslate('NOTIFY.COMMUNITY_APPROVE_APPLICATION_FAILED', Notify.T_ERROR);
        	});
        };

		$scope.init = function() {

			$scope.refreshDataFeed();
			$scope.fetchCommunity();
		};

		UnauthReload.check();
		$scope.$on('$routeChangeSuccess', $scope.init);
		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);