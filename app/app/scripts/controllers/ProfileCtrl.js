'use strict';

angular.module('hearth.controllers').controller('ProfileCtrl', [
	'$scope', 'Auth', 'flash', 'Errors', '$routeParams', '$location', 'UsersService', '$rootScope', '$timeout', 'Geocoder', '$window', '$translate', '$analytics', '$q', 'ResponseErrors',
	function($scope, Auth, flash, Errors, $routeParams, $location, UsersService, $rootScope, $timeout, Geocoder, $window, $translate, $analytics, $q, ResponseErrors) {
		var fetchAds, fetchRatings, fetchUser;
		$scope.progress = 30;
		$scope.rating = {};
		$scope.adEditing = false;
		$scope.expandAd(null);
		$scope.routeParams = $routeParams;
		$scope.location = $location;
		$scope.$watch('routeParams.action', function(newval) {
			var defaultEvent, event, _ref;
			defaultEvent = 'ads';
			if (((_ref = Auth.getCredentials()) != null ? _ref._id : void 0) !== $routeParams.id) {
				defaultEvent = 'feedback';
			}
			event = newval || defaultEvent;
			$scope.profilePageType = event;
			return $scope.$broadcast(event + 'Selected');
		});
		$scope.$watch('location.search().id', function(newval) {
			if (newval === undefined || newval === null) {
				return $scope.expandAd(null);
			} else {
				return $scope.ads.forEach(function(item) {
					if (item._id === newval) {
						return $scope.expandAd(item);
					}
				});
			}
		});
		fetchUser = function() {
			$scope.avatar = {};
			return UsersService.get($routeParams.id).then(function(data) {
				if (data._id == null) {
					$location.path('404');
				}
				if ((data._type != null) && data._type === 'Community') {
					$location.path('/community/' + data._id);
				}
				$scope.profile = data;
				$scope.avatar = $scope.profile.avatar;
				if ($routeParams.action === 'edit') {
					$scope.startProfileEdit;
				}
				return $scope.fetchFollows();
			}, function(err) {
				var _ref;
				if ((_ref = err.status) === 400 || _ref === 404 || _ref === 500) {
					return $location.path('404');
				}
			});
		};
		fetchAds = function(refresh) {
			var searchParams;
			searchParams = {
				userId: $routeParams.id,
				limit: $scope.limit,
				offset: $scope.offset
			};
			return UsersService.queryPosts(searchParams).then(function(ads) {
				$scope.lastQueryReturnedCount = ads.length;
				if (refresh || ($scope.ads == null)) {
					$scope.ads = [];
				}
				return ads.forEach(function(item) {
					$scope.ads.push(item);
					if (($location.search().id != null) && $location.search().id === item._id) {
						return $scope.expandAd(item);
					}
				});
			});
		};
		fetchRatings = function() {
			var searchParams;
			searchParams = {
				userId: $routeParams.id,
				limit: $scope.limit,
				offset: $scope.offset
			};
			if ($scope.ratings == null) {
				$scope.ratings = [];
			}
			return UsersService.queryRatings(searchParams).then(function(ratings) {
				$scope.lastQueryReturnedCount = ratings.length;
				return ratings.forEach(function(item) {
					return $scope.ratings.push(item);
				});
			});
		};
		$scope.fetchFollows = function() {
			$scope.showFollow = false;
			$scope.profile.relation = '';
			$scope.relations = {
				followees: [],
				followers: [],
				friends: [],
				communities: []
			};
			if ($scope.loggedUser._id != null) {
				UsersService.isFollower($scope.profile._id, $scope.loggedUser._id).then(function(res) {
					if (res.isFollower) {
						$scope.profile.relation = 'followee';
					}
					return UsersService.isFriend($scope.profile._id, $scope.loggedUser._id).then(function(res) {
						if (res.getFriend) {
							return $scope.profile.relation = 'friend';
						}
					});
				});
				if ($scope.loggedUser._id === $scope.profile._id) {
					UsersService.queryFollowees($scope.profile._id).then(function(result) {
						$scope.relations.followees = result || [];
						return $scope.unifyFollowers();
					});
					UsersService.queryFollowers($scope.profile._id).then(function(result) {
						$scope.relations.followers = result || [];
						return $scope.unifyFollowers();
					});
				}
			}
			return UsersService.queryFriends($scope.profile._id).then(function(result) {
				$scope.relations.friends = result.filter(function(item) {
					return item.userType !== 'Community';
				}) || [];
				$scope.relations.memberOfCommunities = result.filter(function(item) {
					return item.userType === 'Community';
				}) || [];
				return $scope.unifyFollowers();
			});
		};
		$scope.unifyFollowers = function() {
			var followee, follower, friends, person;
			if ($scope.relations != null) {
				friends = (function() {
					var _i, _len, _ref, _results;
					_ref = $scope.relations.friends;
					_results = [];
					for (_i = 0, _len = _ref.length; _i < _len; _i++) {
						person = _ref[_i];
						_results.push(person.userId);
					}
					return _results;
				})();
				$scope.relations.followees = (function() {
					var _i, _len, _ref, _ref1, _results;
					_ref = $scope.relations.followees;
					_results = [];
					for (_i = 0, _len = _ref.length; _i < _len; _i++) {
						followee = _ref[_i];
						if ((_ref1 = followee.userId, __indexOf.call(friends, _ref1) < 0) && followee.userType !== 'Community') {
							_results.push(followee);
						}
					}
					return _results;
				})();
				$scope.relations.followers = (function() {
					var _i, _len, _ref, _ref1, _results;
					_ref = $scope.relations.followers;
					_results = [];
					for (_i = 0, _len = _ref.length; _i < _len; _i++) {
						follower = _ref[_i];
						if ((_ref1 = follower.userId, __indexOf.call(friends, _ref1) < 0) && follower.userType !== 'Community') {
							_results.push(follower);
						}
					}
					return _results;
				})();
				return $scope.showFollow = true;
			}
		};
		$scope.$on('adsSelected', function() {
			$scope.init();
			return fetchAds();
		});
		$scope.$on('aboutSelected', function() {
			return $scope.init();
		});
		$scope.$on('adsScrolling', function() {
			return fetchAds();
		});
		$scope.$on('feedbackScrolling', function() {
			return fetchAds();
		});
		$scope.$on('feedbackSelected', function() {
			$scope.init();
			return fetchRatings();
		});
		$scope.$on('removePost', function(event, postId) {
			return $scope.ads.forEach(function(value, index) {
				if (value._id === postId) {
					return $scope.ads.splice(index, 1);
				}
			});
		});
		$scope.init = function() {
			$scope.limit = 15;
			$scope.offset = 0;
			$scope.lastQueryReturnedCount = 0;
			$scope.ads = [];
			$scope.ratings = [];
			$scope.score = 0;
			return fetchUser();
		};

		function _getIsMine() {
			var isMine = $scope.loggedUser && $routeParams.id === $scope.loggedUser._id,
				isMineCommunity = $scope.loggedCommunity && $routeParams.id === $scope.loggedCommunity._id;

			$rootScope.isMine = isMine || isMineCommunity;
		}
		$scope.$watch('loggedUser', _getIsMine);
		$scope.$watch('loggedCommunity', _getIsMine);

		$scope.showRatingDialog = function(score) {
			$scope.$broadcast('cancelReplyingAd');
			$scope.rating.errors = {};
			$scope.rating.data = {
				id: $scope.profile._id,
				score: score
			};
			if ($scope.profile._id != null) {
				$scope.rating.dialogShown = true;
			}
			if (score > 0) {
				return $scope.feedbackPlaceholder = $translate('POSITIVE_FEEDBACK_PLACEHOLDER');
			} else {
				return $scope.feedbackPlaceholder = $translate('NEGATIVE_FEEDBACK_PLACEHOLDER');
			}
		};
		$scope.saveRating = function() {
			if ($scope.rating.data.text.length < 3) {
				$scope.rating.errors = {
					text: 'ERR_RATING_TEXT_MIN_LEN'
				};
				return false;
			}
			delete $scope.rating.errors;
			delete $scope.rating.dialogShown;
			return UsersService.addRating($scope.rating.data).then(function(data) {
				var event, value;
				flash.success = 'RATING_WAS_SAVED';
				$scope.rating.dialogShown = false;
				$scope.go('feedback');
				if ($scope.rating.data.score > 0) {
					event = 'send thumb up';
					value = 25;
				} else {
					event = 'send thumb down';
					value = null;
				}
				return $analytics.eventTrack(event, {
					category: 'Other profile',
					label: 'thanks',
					value: value
				});
			}, function(res) {
				return Errors.process(res, $scope.rating);
			});
		};
		$scope.updateProfile = function() {

			return UsersService.update($scope.editedProfile).then(function() {
				flash.success = 'PROFILE_WAS_UPDATED';
				$scope.profileEditing = false;
				$scope.go('ads');
				return $scope.init();
			}, function(res) {
				return $scope.errorsProfile = new ResponseErrors(res);
			});
		};
		$scope.startProfileEdit = function() {
			$scope.editedProfile = UsersService.clone($scope.profile);
			$scope.profileErrors = {};
			return $scope.profileEditing = true;
		};
		$scope.cancelProfileEdit = function() {
			$scope.avatar = $scope.profile.avatar;
			return $scope.profileEditing = false;
		};
		$scope.startProfileDelete = function() {
			$scope.profileErrors = {};
			$scope.profileEditing = false;
			return $scope.profileDeleting = true;
		};
		$scope.cancelProfileDelete = function() {
			$scope.profileEditing = true;
			return $scope.profileDeleting = false;
		};
		$scope.deleteProfile = function() {
			return UsersService.remove($scope.profile).then(function() {
				$analytics.eventTrack('delete account confirmed', {
					category: 'My profile',
					label: 'delete account confirmed'
				});
				$location.url('feedback?fromDelete');
				return $timeout(function() {
					return window.location.reload();
				});
			});
		};
		$scope.scrollToTop = function() {
			return $window.scroll(0, 0);
		};
		$scope.avatarUploadStarted = function() {
			return $scope.avatarUpload = true;
		};
		$scope.avatarUploadSucceeded = function(event) {
			$scope.avatar = angular.fromJson(event.target.responseText);
			$scope.editedProfile.avatar = $scope.avatar;
			return $scope.avatarUpload = false;
		};
		$scope.avatarUploadFailed = function() {
			$scope.avatarUpload = false;
			return flash.error = 'AVATAR_UPLOAD_FAILED';
		};
		$scope.loadMore = function(type) {
			if ($scope.lastQueryReturnedCount === $scope.limit) {
				$scope.offset = $scope.offset + $scope.limit;
				return $scope.$broadcast(type + 'Scrolling');
			}
		};
		$scope.go = function(where, params) {
			var path;
			if (where === 'detail' && (params != null)) {
				if ($scope.isMine) {
					return;
				}
				if (($location.search().id != null) && $location.search().id === params) {
					return $location.search('id', null);
				} else {
					return $location.search('id', params);
				}
			} else if (where === 'profile') {
				path = '/profile/' + params;
				return $location.path(path);
			} else {
				path = '/profile/' + $routeParams.id + '/' + where;
				$location.path(path);
				return $scope.$broadcast(where + 'Selected');
			}
		};
		return $scope.follow = function(userId, unfollow) {
			var promise;
			if (userId === $scope.loggedUser._id) {
				return;
			}
			promise = null;
			if (unfollow) {
				promise = UsersService.removeFollower(userId, $scope.loggedUser._id);
			} else {
				promise = UsersService.addFollower(userId, $scope.loggedUser._id);
			}
			return promise.then(function() {
				return $scope.fetchFollows();
			});
		};
	}
]);