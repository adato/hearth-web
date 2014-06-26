'use strict';

/**
 * @ngdoc service
 * @name hearth.services.UsersService
 * @description
 */

angular.module('hearth.services').service('UsersService', [
	'User', 'UserPosts', 'UserRatings', '$q', 'Followers', 'Friends', 'Followees', '$analytics', 'CommunityMemberships',
	function(User, UserPosts, UserRatings, $q, UserFollowers, UserFriends, UserFollowees, $analytics, CommunityMemberships) {

		this.clone = function(profile) {
			return new User(angular.extend({}, profile));
		};

		this.get = function(id) {
			var deferred = $q.defer();

			User.get({
				user_id: id
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.update = function(profile) {
			var deferred = $q.defer();

			profile.$edit(function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.remove = function(profile) {
			var deferred = $q.defer();

			profile.$remove(function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.queryPosts = function(searchParams) {
			var deferred = $q.defer();

			UserPosts.get(searchParams, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.queryRatings = function(searchParams) {
			var deferred = $q.defer();

			UserRatings.get(searchParams, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.addRating = function(rating) {
			var deferred = $q.defer();

			UserRatings.add(rating, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.addFollower = function(user_id) {
			var deferred = $q.defer();

			UserFollowers.add({
				user_id: user_id
			}, function(data) {
				$analytics.eventTrack('add follower', {
					category: 'followers',
					label: 'add follower'
				});
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.removeFollower = function(user_id, followerId) {
			var deferred = $q.defer();

			UserFollowers.remove({
				user_id: user_id,
				followerId: followerId
			}, function(data) {
				$analytics.eventTrack('remove follower', {
					category: 'followers',
					label: 'remove follower'
				});
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.isFollower = function(user_id, followerId) {
			var deferred = $q.defer();

			UserFollowers.show({
				user_id: user_id,
				followerId: followerId
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.isFriend = function(user_id, friendId) {
			var deferred;
			deferred = $q.defer();
			UserFriends.show({
				user_id: user_id,
				friendId: friendId
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.queryFriends = function(user_id) {
			var deferred = $q.defer();

			UserFriends.query({
				user_id: user_id
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.queryFollowers = function(user_id) {
			var deferred = $q.defer();

			UserFollowers.query({
				user_id: user_id
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.queryFollowees = function(user_id) {
			var deferred = $q.defer();

			UserFollowees.query({
				user_id: user_id
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.queryCommunities = function(user_id) {
			var deferred = $q.defer();

			CommunityMemberships.query({
				user_id: user_id
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		return this;
	}
]);