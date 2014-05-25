'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityProfileCtrl
 * @description 
 */
 
angular.module('hearth.controllers').controller('CommunityProfileCtrl', [
	'$scope', '$routeParams', '$location', 'CommunityService', 'UsersService', '$rootScope', 'ResponseErrors', 'Errors', 'flash', '$translate', '$window', '$analytics',
	function($scope, $routeParams, $location, CommunityService, UsersService, $rootScope, ResponseErrors, Errors, flash, $translate, $window, $analytics) {
		var init;
		$scope.errorsUpdateCommunity = null;
		$scope.editingCommunity = false;
		$scope.routeParams = $routeParams;
		$scope.profilePageType = 'ads';
		$scope.location = $location;
		$scope.fetchProfile = function() {
			$rootScope.isMine = false;
			return CommunityService.get($routeParams.id).then(function(data) {
				$scope.community = $scope.profile = data;
				return UsersService.get($scope.community.admin).then(function(data) {
					var _ref;
					$scope.communityAdmin = data;
					if (((_ref = $rootScope.loggedCommunity) != null ? _ref._id : void 0) === $scope.community._id) {
						$rootScope.isMine = true;
					}
					return $scope.fetchMembers();
				}, function(err) {
					var _ref;
					if ((_ref = err.status) === 400 || _ref === 404 || _ref === 500) {
						return $location.path('404');
					}
				});
			}, function(err) {
				var _ref;
				if ((_ref = err.status) === 400 || _ref === 404 || _ref === 500) {
					return $location.path('404');
				}
			});
		};
		$scope.fetchMembers = function() {
			return CommunityService.queryMembers($routeParams.id).then(function(data) {
				$scope.communityMembers = data;
				if (!$rootScope.isMine) {
					CommunityService.getApplicant($routeParams.id, $scope.loggedUser._id).then(function(data) {
						var _ref;
						if (data.isFollower === true) {
							$scope.membershipStatus = 'requested';
						}
						if (_ref = $scope.loggedUser._id, __indexOf.call($scope.communityMembers.map(function(member) {
							return member.userId;
						}), _ref) >= 0) {
							return $scope.membershipStatus = 'member';
						}
					});
					return;
				}
				return CommunityService.queryApplicants($routeParams.id).then(function(data) {
					return $scope.communityApplicants = data.filter(function(applicant) {
						var _ref;
						if (_ref = applicant.userId, __indexOf.call($scope.communityMembers.map(function(member) {
							return member.userId;
						}), _ref) < 0) {
							return applicant;
						}
					});
				});
			});
		};
		$scope.fetchPosts = function() {
			var searchParams;
			searchParams = {
				communityId: $routeParams.id,
				limit: $scope.limit,
				offset: $scope.offset,
				include_not_active: 1
			};
			return CommunityService.queryPosts(searchParams).then(function(data) {
				$scope.posts = [];
				return data.forEach(function(item) {
					if (item.is_active === undefined) {
						item.is_active = true;
					}
					return $scope.posts.push(item);
				});
			}, function(err) {
				return console.log(err);
			});
		};
		$scope.fetchRatings = function() {
			var searchParams;
			searchParams = {
				communityId: $routeParams.id,
				limit: $scope.limit,
				offset: $scope.offset
			};
			return CommunityService.queryRatings(searchParams).then(function(data) {
				$scope.ratings = data;
				return $scope.ratings;
			}, function(err) {
				return console.log(err);
			});
		};
		$scope.$on('search', function() {
			$scope.profilePageType = $scope.routeParams.action || 'ads';
			if ($scope.profilePageType === 'ads') {
				$scope.fetchPosts();
			}
			if ($scope.profilePageType === 'feedback') {
				return $scope.fetchRatings();
			}
		});
		$scope.loadMore = function() {
			if ($scope.lastQueryReturnedCount > 0) {
				$scope.offset = $scope.offset + $scope.limit;
				return $scope.$broadcast('search');
			}
		};
		$scope.$watch('location.search().id', function(newval) {
			if (newval === undefined || newval === null) {
				return $scope.expandAd(null);
			} else {
				return $scope.posts.forEach(function(item) {
					if (item._id === newval) {
						return $scope.expandAd(item);
					}
				});
			}
		});
		$scope.showRatingDialog = function(score) {
			$scope.$broadcast('cancelReplyingAd');
			$scope.rating.errors = {};
			$scope.rating.data = {
				id: $scope.community._id,
				score: score
			};
			if ($scope.community._id != null) {
				$scope.rating.dialogShown = true;
			}
			if (score > 0) {
				$scope.feedbackPlaceholder = $translate('POSITIVE_FEEDBACK_PLACEHOLDER');
				return $scope.feedbackPlaceholder;
			} else {
				$scope.feedbackPlaceholder = $translate('NEGATIVE_FEEDBACK_PLACEHOLDER');
				return $scope.feedbackPlaceholder;
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
			return CommunityService.addRating($scope.rating.data).then(function() {
				var event, value;
				flash.success = 'RATING_WAS_SAVED';
				$scope.rating.dialogShown = false;
				if ($scope.rating.data.score > 0) {
					event = 'send thumb up';
					value = 25;
				} else {
					event = 'send thumb down';
					value = null;
				}
				$analytics.eventTrack(event, {
					category: 'Community profile',
					label: 'thanks',
					value: value
				});
				return init();
			}, function(res) {
				return Errors.process(res, $scope.rating);
			});
		};
		$scope.startProfileEdit = function() {
			$scope.editingCommunity = true;
			$scope.editCommunity = angular.copy($scope.community);
			if ($scope.editCommunity.terms) {
				$scope.editCommunity.termsShown = true;
				return $scope.editCommunity.termsShown;
			}
		};
		$scope.cancelProfileEdit = function() {
			$scope.editingCommunity = false;
			$scope.editCommunity = null;
			return $scope.editCommunity;
		};
		$scope.updateCommunity = function() {
			var _ref, _ref1;
			if ((_ref = $scope.$$childHead) != null ? (_ref1 = _ref.updateCommunityForm) != null ? _ref1.$valid : void 0 : void 0) {
				return CommunityService.update($scope.editCommunity).then(function(data) {
					flash.success = $translate('COMMUNITY_UPDATED_DONE');
					return $window.location.reload();
				}, function(err) {
					return $scope.errorsUpdateCommunity = new ResponseErrors(err);
				});
			}
		};
		$scope.avatarUploadStarted = function() {
			$scope.avatarUpload = true;
			return $scope.avatarUpload;
		};
		$scope.avatarUploadSucceeded = function(event) {
			$scope.avatar = angular.fromJson(event.target.responseText);
			$scope.editCommunity.avatar = $scope.avatar;
			$scope.avatarUpload = false;
			return $scope.avatarUpload;
		};
		$scope.avatarUploadFailed = function() {
			$scope.avatarUpload = false;
			flash.error = 'AVATAR_UPLOAD_FAILED';
			return flash.error;
		};
		$scope.follow = function(communityId, unfollow) {
			var promise;
			if (communityId === $scope.loggedCommunity._id) {
				return;
			}
			promise = null;
			if (unfollow) {
				promise = CommunityService.removeApplicant(communityId, $scope.loggedUser._id);
			} else {
				promise = CommunityService.addApplicant(communityId);
			}
			return promise.then(function() {
				return init();
			});
		};
		$scope.acceptMembership = function(userId) {
			return UsersService.addFollower(userId).then(function() {
				return init();
			});
		};
		$scope.rejectMembership = function(userId) {
			return CommunityService.removeApplicant($scope.community._id, userId).then(function() {
				return init();
			});
		};
		$scope.removeMember = function(userId) {
			if (window.confirm($translate('COMMUNITY_MEMBER_REMOVE_ARE_YOU_SURE'))) {
				return CommunityService.removeMember($scope.community._id, userId).then(function() {
					return init();
				});
			}
		};
		$scope.$on('removePost', function(event, postId) {
			return $scope.posts.forEach(function(value, index) {
				if (value._id === postId) {
					return $scope.posts.splice(index, 1);
				}
			});
		});
		$scope.go = function(where, params) {
			var path;
			if (where === 'detail' && params) {
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
		init = function() {
			$scope.communityMembers = $scope.communityApplicants = [];
			$scope.community = $scope.profile = $scope.editCommunity = $scope.rating = {};
			$scope.posts = $scope.ratings = [];
			$scope.membershipStatus = null;
			$scope.communityAdmin = {};
			$scope.fetchProfile();
			$scope.limit = 15;
			$scope.offset = 0;
			$scope.lastQueryReturnedCount = 0;
			return $scope.$broadcast('search');
		};
		return init();
	}
]);