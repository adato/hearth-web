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
			if($route.current.$$route)
				$scope.pageSegment = $route.current.$$route.segment;
		};

		$scope.applyForCommunity = function() {

			CommunityApplicants.add({communityId: $scope.info._id}, function(res) {
				$scope.init();
				Notify.addSingleTranslate('NOTIFY.COMMUNITY_APPLY_SUCCESS', Notify.T_SUCCESS);
			}, function() {
				Notify.addSingleTranslate('NOTIFY.COMMUNITY_APPLY_FAILED', Notify.T_ERROR);
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

			UnauthReload.check();

			$scope.refreshDataFeed();
			$scope.fetchCommunity();
		};

		$scope.$on('$routeChangeSuccess', $scope.init);
		$scope.$on('initFinished', $scope.init);
		$rootScope.initFinished && $scope.init();
	}
]);