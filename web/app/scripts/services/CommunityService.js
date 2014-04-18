'use strict';

angular.module('hearth.services').service('CommunityService', [
	'$q', 'Community', 'CommunityPosts', 'CommunityRatings', 'CommunityApplicants', 'CommunityMembers',
	function($q, Community, CommunityPosts, CommunityRatings, CommunityApplicants, CommunityMembers) {
		this.add = function(community) {
			var deferred;
			deferred = $q.defer();
			Community.add(community, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.update = function(community) {
			var deferred;
			deferred = $q.defer();
			community.$edit(function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.get = function(id) {
			var deferred;
			deferred = $q.defer();
			Community.get({
				communityId: id
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.query = function(searchParams) {
			var deferred;
			deferred = $q.defer();
			Community.query(searchParams, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.queryPosts = function(searchParams) {
			var deferred;
			deferred = $q.defer();
			CommunityPosts.get(searchParams, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.queryRatings = function(searchParams) {
			var deferred;
			deferred = $q.defer();
			CommunityRatings.get(searchParams, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.addRating = function(rating) {
			var deferred;
			deferred = $q.defer();
			CommunityRatings.add(rating, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.addApplicant = function(communityId) {
			var deferred;
			deferred = $q.defer();
			CommunityApplicants.add({
				communityId: communityId
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.removeApplicant = function(communityId, applicantId) {
			var deferred;
			deferred = $q.defer();
			CommunityApplicants.remove({
				communityId: communityId,
				applicantId: applicantId
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.queryApplicants = function(communityId) {
			var deferred;
			deferred = $q.defer();
			CommunityApplicants.query({
				communityId: communityId
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.getApplicant = function(communityId, applicantId) {
			var deferred;
			deferred = $q.defer();
			CommunityApplicants.show({
				communityId: communityId,
				applicantId: applicantId
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.queryMembers = function(communityId) {
			var deferred;
			deferred = $q.defer();
			CommunityMembers.query({
				communityId: communityId
			}, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.removeMember = function(communityId, memberId) {
			var deferred;
			deferred = $q.defer();
			CommunityMembers.remove({
				communityId: communityId,
				memberId: memberId
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

