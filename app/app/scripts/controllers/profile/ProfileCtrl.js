'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ProfileCtrl
 * @description
 */

angular.module('hearth.controllers').controller('ProfileCtrl', [
	'$scope', '$route', 'User', '$routeParams', 'UsersService', '$rootScope', '$timeout', 'Karma', '$location', 'UserRatings', 'Notify',

	function($scope, $route, User, $routeParams, UsersService, $rootScope, $timeout, Karma, $location, UserRatings, Notify) {
		$scope.loaded = false;
		$scope.info = false;

		// ratings
		$scope.sendingRating = false;
		$scope.rating = {
			score: 1,
			text: ''
		};
		$scope.showError = {
			text: false
		}

		$scope.isMine = function () {
			var _mineUser = ($rootScope.loggedUser) ? $rootScope.loggedUser._id === $routeParams.id: false;
			var _mineCommunity = ($rootScope.loggedCommunity) ? $rootScope.loggedCommunity._id == $routeParams.id: false;
			
			return _mineCommunity || _mineUser;
		};

		$scope.citiesToString = function(info) {
			var list = [];
			info.locations.forEach(function(item) {
				if(item.city) list.push(item.city);
			});

			return list.join(", ");
		};

		$scope.fetchUser = function () {
			// dont load user when there is no ID in params
			if(! $routeParams.id) return false;
			
			if($scope.info._id !== $routeParams.id) {
				$scope.loaded = false;
			}

			User.get({user_id: $routeParams.id}, function(res) {
				$scope.info = res;
				$scope.info.cities = $scope.citiesToString(res);

				$scope.info.karma = Karma.count(res.up_votes, res.down_votes);
				$scope.mine = $scope.isMine();
				$scope.loaded = true;

				$scope.$broadcast("profileTopPanelLoaded");
			}, function (res) {
				$scope.loaded = true;
			});
		};

		$scope.removeFollower = function(user_id) {

			UsersService.removeFollower(user_id, $rootScope.loggedUser._id);
		};
		
		$scope.addFollower = function(user_id) {
			UsersService.addFollower(user_id);
		};

		$scope.toggleFollow = function(user_id) {
			
			if($scope.info.is_followed) {
				$scope.removeFollower(user_id);
			} else {
				$scope.addFollower(user_id);
			}
			
			$scope.info.is_followed = !$scope.info.is_followed;
		}

		$scope.refreshDataFeed = function() {
			$rootScope.subPageLoaded = false;
    		$scope.pagePath = $route.current.originalPath;
    		$scope.pageSegment = $route.current.$$route.segment;
		};

		$scope.refreshUser = function() {
			console.log("Loading user info");
			$scope.refreshDataFeed();
			$scope.fetchUser();
		};
		
		$scope.scrollToUserRatingForm = function() {
			// scroll to form
			setTimeout(function() {
				$('html,body').animate({scrollTop: $("#received-rating-form").offset().top - 200}, 500);
			}, 300);
		};

		// will redirect user to user ratings and open rating form
		$scope.openUserRatingForm = function(score) {
			var ratingUrl = '/profile/'+$scope.info._id+'/received-ratings';
			var removeListener;

			// set default values
			$scope.showError.text = false;
			$scope.rating.score = score;
			$scope.rating.text = '';

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


		$scope.sendRating = function(ratingOrig) {
			var rating;
			var ratings = {
				true: -1,
				false: 1
			};

			$scope.showError.text = false;

			if(!ratingOrig.text) {
				return $scope.showError.text = true;
			}

			// transform rating.score value from true/false to -1 and +1
			rating = angular.copy(ratingOrig);
			rating.score = ratings[rating.score];

			// lock
			if($scope.sendingRating)
				return false;
			$scope.sendingRating = true;

			// send rating to API
			UserRatings.add({id: $scope.info._id, rating: rating}, function(res) {

				// remove lock
				$scope.sendingRating = false;

				// close form
				$scope.closeUserRatingForm();

				// refresh user counters
				$scope.refreshUser();

				// broadcast new rating - this will add rating to list
				$scope.$broadcast('userRatingsAdded', res);
				Notify.addTranslate('NOTIFY.USER_RATING_SUCCESS', Notify.T_SUCCESS);

			}, function(err) {
				// remove lock
				$scope.sendingRating = false;

				Notify.hideAll('.rating-notify-box', function() {
					// handle error
					Notify.addTranslate('NOTIFY.USER_RATING_FAILED', Notify.T_ERROR, '.rating-notify-box');
				});
			});
		};

		$scope.$on('profileRefreshUser', $scope.refreshUser);
		$scope.$on('$routeChangeSuccess', $scope.refreshUser);
		$scope.$on('initFinished', $scope.refreshUser);
		$rootScope.initFinished && $scope.refreshUser();
	}
]);