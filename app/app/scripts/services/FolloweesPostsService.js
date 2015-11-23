'use strict';

/**
 * @ngdoc service
 * @name hearth.services.FolloweesPostsService
 * @description
 */

angular.module('hearth.services').service('FolloweesPostsService', [
	'FolloweePosts', '$q',
	function(FolloweePosts, $q) {
		this.query = function(params) {
			var deferred;
			deferred = $q.defer();
			FolloweePosts.query(params, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		return this;
	}
]);
