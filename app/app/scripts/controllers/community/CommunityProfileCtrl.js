'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityProfileCtrl', [
	'$scope', '$stateParams', '$rootScope', '$location', 'Community', 'CommunityApplicants', 'CommunityMembers', 'CommunityLeave', '$window', 'Notify', 'UnauthReload', 'CommunityRatings', 'Karma',
	function($scope, $stateParams, $rootScope, $location, Community, CommunityApplicants, CommunityMembers, CommunityLeave, $window, Notify, UnauthReload, CommunityRatings, Karma) {
		$scope.loaded = false;
		$scope.info = false;
		$scope.topLoaded = false;
		$scope.loadingCounter = 0; // subpage will load only when there is no other request for top panel data
		$scope.sendingApplication = false;
		$scope.sendingRating = false;
		$scope.activePage = false;
        $scope.showUserRatingForm = false;
		$scope.rating = {
            current_community_id: null,
            score: true,
            text: ''
        };
        $scope.showError = {
            text: false
        };

		$scope.amIAdmin = function(res) {
			return $rootScope.loggedUser._id == res.admin;
		};

		$scope.fetchCommunity = function() {
			if(!$stateParams.id) return false;

			// if we load profile of another user (there are different IDs) scroll to top
			if ($scope.info._id !== $stateParams.id) {
				$rootScope.top(0, 1);
				$scope.loaded = false;
			}

			$scope.loadingCounter++;
			Community.get({_id: $stateParams.id }, function(res) {
				$scope.loaded = true;

				res.post_total = res.post_count.needs + res.post_count.offers;
                res.karma = Karma.count(res.up_votes, res.down_votes);
            
                $scope.communityLink = $rootScope.getProfileLink('Community', res._id);
				$scope.loadingCounter--;
				$scope.info = res;
				$scope.topLoaded = true;
				// $scope.loaded = true;
				$scope.mine = $rootScope.isMine(res.admin); // is community mine?
				$scope.managing = $scope.amIAdmin(res); // is community mine?
			}, function(res) {
				$scope.loadingCounter--;
				$scope.loaded = true;
				$scope.info = false;
				$scope.mine = false;
				$scope.managing = false;

			});
		};

        // scroll to user Rating form when opened
        $scope.scrollToRatingForm = function() {
            // scroll to form
            setTimeout(function() {
                $('html,body').animate({scrollTop: $("#received-rating-form").offset().top - 200}, 500);
            }, 300);
        };
        
        // will redirect user to user ratings and open rating form
        $scope.openRatingForm = function(score) {
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
                $scope.scrollToRatingForm();
            } else {
            // else jump to the righ address and there jump down
                removeListener = $scope.$on('$stateChangeSuccess', function() {
                    removeListener();
                    $scope.scrollToRatingForm();
                });
                $location.url(ratingUrl);
            }
        };

        // will close form and set to default state
        $scope.closeUserRatingForm = function() {
            $scope.showUserRatingForm = false;
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
                $scope.scrollToRatingForm();
            } else {
            // else jump to the righ address and there jump down
                removeListener = $scope.$on('$routeChangeSuccess', function() {
                    removeListener();
                    $scope.scrollToRatingForm();
                });
                $location.url(ratingUrl);
            }
        };

		$scope.refreshDataFeed = function() {
			$scope.$broadcast('refreshSubpage');
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
        	if($scope.rejectApplicationLock)
        		return false;
        	$scope.rejectApplicationLock = true;
        	

        	CommunityApplicants.remove({communityId: $scope.info._id, applicantId: id}, function(res) {
        		$scope.rejectApplicationLock = false;
        		$scope.init();
				Notify.addSingleTranslate('NOTIFY.COMMUNITY_REJECT_SUCCESS', Notify.T_SUCCESS);
        	}, function() {
        		$scope.rejectApplicationLock = false;
				Notify.addSingleTranslate('NOTIFY.COMMUNITY_REJECT_FAILED', Notify.T_ERROR);
        	});
        };

        $scope.leaveCommunity = function() {
        	if($scope.leaveCommunityLock)
        		return false;
        	$scope.leaveCommunityLock = true;

			CommunityLeave.leave({community_id: $scope.info._id}, function(res) {
        		$scope.leaveCommunityLock = false;

				Notify.addSingleTranslate('NOTIFY.COMMUNITY_LEAVE_SUCCESS', Notify.T_SUCCESS);
        		$scope.init();
        		$rootScope.$broadcast("reloadCommunities");
        	}, function(res) {

        		$scope.leaveCommunityLock = false;
				Notify.addSingleTranslate('NOTIFY.COMMUNITY_LEAVE_FAILED', Notify.T_ERROR);
        	});
        };

        $scope.approveApplication = function(id) {
        	if($scope.approveApplicationLock)
        		return false;
        	$scope.approveApplicationLock = true;


        	CommunityMembers.add({communityId: $scope.info._id, user_id: id}, function(res) {
        		$scope.approveApplicationLock = false;

				Notify.addSingleTranslate('NOTIFY.COMMUNITY_APPROVE_APPLICATION_SUCCESS', Notify.T_SUCCESS);
        		$scope.init();
        	}, function() {
        		$scope.approveApplicationLock = false;
				Notify.addSingleTranslate('NOTIFY.COMMUNITY_APPROVE_APPLICATION_FAILED', Notify.T_ERROR);
        	});
        };


		// scroll to user Rating form when opened
		$scope.scrollToRatingForm = function() {
			// scroll to form
			setTimeout(function() {
				$('html,body').animate({scrollTop: $("#received-rating-form").offset().top - 200}, 500);
			}, 300);
		};
		
        $scope.addItem = function() {
        	var preset = {
        		current_community_id: ($scope.mine) ? $scope.info._id : null,
        		related_communities: (!$scope.mine) ? [{_id: $scope.info._id, name: $scope.info.name}] : [],
        	}

        	$rootScope.editItem(null, null, preset);
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


		$scope.$on('$stateChangeSuccess', function(ev, route, params) {
			$scope.activePage = params.page;
		});

		UnauthReload.check();
		$scope.init();
	}
]);