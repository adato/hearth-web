'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityProfileCtrl', [
	'$scope', '$routeParams', '$rootScope', 'Community', '$route', 'CommunityApplicants', 'CommunityMembers', 'CommunityLeave', '$window', 'Notify', 'UnauthReload', '$location', 'CommunityRatings',
	function($scope, $routeParams, $rootScope, Community, $route, CommunityApplicants, CommunityMembers, CommunityLeave, $window, Notify, UnauthReload, $location, CommunityRatings) {
		$scope.loaded = false;
		$scope.info = false;
		$scope.loadingCounter = 0; // subpage will load only when there is no other request for top panel data
		$scope.sendingApplication = false;
		// ratings
		$scope.sendingRating = false;
		$scope.rating = {
			current_community_id: null,
			score: true,
			text: ''
		};
		$scope.showError = {
			text: false
		};

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
			Community.get({ communityId: $routeParams.id }, function(res) {

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

		// scroll to user Rating form when opened
		$scope.scrollToUserRatingForm = function() {
			// scroll to form
			setTimeout(function() {
				$('html,body').animate({scrollTop: $("#received-rating-form").offset().top - 200}, 500);
			}, 300);
		};

		// will redirect user to user ratings and open rating form
		$scope.openUserRatingForm = function(score) {
			var ratingUrl = '/community/'+$scope.info._id+'/received-ratings';
			var removeListener;

			$scope.ratingPosts = [];
	        $scope.loadedRatingPosts = false;
			// set default values
			$scope.showError.text = false;
			$scope.rating.current_community_id = null;
			$scope.rating.score = score;
			$scope.rating.text = '';
			$scope.rating.post_id = 0;
			// select first option in posts select - eg default value			
			$("#ratingsPostsSelect").val($("#ratingsPostsSelect option:first").val());

			// show form
			$scope.showUserRatingForm = true;

			// if we are on rating URL just jump down
			if($location.url() == ratingUrl) {
				$scope.scrollToUserRatingForm();
			} else {
			// else jump to the righ address and there jump down
				removeListener = $scope.$on('$routeChangeSuccess', function() {
					removeListener();
					$scope.scrollToUserRatingForm();
				});
				$location.url(ratingUrl);
			}
		};

		// will close form and set to default state
		$scope.closeUserRatingForm = function() {
			$scope.showUserRatingForm = false;
		};

		// send rating to API
		$scope.sendRating = function(ratingOrig) {
			var rating;
			var ratings = {
				false: -1,
				true: 1
			};

			$scope.showError.text = false;

			if(!ratingOrig.text)
				return $scope.showError.text = true;

			// transform rating.score value from true/false to -1 and +1
			rating = angular.copy(ratingOrig);
			rating.score = ratings[rating.score];
			rating.post_id = rating.post_id || null;

			var out = {
				current_community_id: rating.current_community_id,
				id: $scope.info._id,
				rating: rating
			};

			// lock - dont send twice
			if($scope.sendingRating)
				return false;
			$scope.sendingRating = true;

			// send rating to API
			CommunityRatings.add(out, function(res) {

				// remove lock
				$scope.sendingRating = false;

				// close form
				$scope.closeUserRatingForm();

				// broadcast new rating - this will add rating to list
				$scope.$broadcast('communityRatingsAdded', res);
				// Notify.addSingleTranslate('NOTIFY.USER_RATING_SUCCESS', Notify.T_SUCCESS);

			}, function(err) {
				// remove lock
				$scope.sendingRating = false;

				// handle error
				Notify.addSingleTranslate('NOTIFY.USER_RATING_FAILED', Notify.T_ERROR, '.rating-notify-box');
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