angular.module('hearth.services').service('UsersService', [
	'User', 'UserPosts', 'UserRatings', '$q', 'Followers', 'Friends', 'Followees', '$analytics', 'CommunityMemberships',
	function(User, UserPosts, UserRatings, $q, UserFollowers, UserFriends, UserFollowees, $analytics, CommunityMemberships) {

		this.clone = function(profile) {
			return new User(angular.extend({}, profile));
		};

		this.get = function(id) {
			var deferred = $q.defer();

			User.get({
				userId: id
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

		this.addFollower = function(userId, followerId) {
			var deferred = $q.defer();

			UserFollowers.add({
				userId: userId
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

		this.removeFollower = function(userId, followerId) {
			var deferred = $q.defer();

			UserFollowers.remove({
				userId: userId,
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

		this.isFollower = function(userId, followerId) {
			var deferred = $q.defer();

			UserFollowers.show({
				userId: userId,
				followerId: followerId
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.isFriend = function(userId, friendId) {
			var deferred;
			deferred = $q.defer();
			UserFriends.show({
				userId: userId,
				friendId: friendId
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.queryFriends = function(userId) {
			var deferred = $q.defer();

			UserFriends.query({
				userId: userId
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.queryFollowers = function(userId) {
			var deferred = $q.defer();

			UserFollowers.query({
				userId: userId
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.queryFollowees = function(userId) {
			var deferred = $q.defer();

			UserFollowees.query({
				userId: userId
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

		this.queryCommunities = function(userId) {
			var deferred = $q.defer();

			CommunityMemberships.query({
				userId: userId
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