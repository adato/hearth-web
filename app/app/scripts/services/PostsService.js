'use strict';

/**
 * @ngdoc service
 * @name hearth.services.PostsService
 * @description
 */

angular.module('hearth.services').service('PostsService', [
	'Post', 'PostReplies', '$q',
	function(Post, PostReplies, $q) {
		this.query = function(params) {
			var deferred;
			deferred = $q.defer();
			Post.query(params, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.add = function(post) {
			var deferred;
			deferred = $q.defer();
			Post.add(post, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.update = function(post) {
			var deferred;
			deferred = $q.defer();
			post.id = post._id;
			post.post_id = post._id;
			Post.update(post, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.reply = function(reply) {
			var deferred;
			deferred = $q.defer();
			PostReplies.add(reply, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		this.remove = function(post) {
			var deferred;
			deferred = $q.defer();
			post.id = post._id;
			Post.remove({
				postId: post._id
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