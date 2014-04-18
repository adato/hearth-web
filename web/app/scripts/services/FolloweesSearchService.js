'use strict';

angular.module('hearth.services').service('FolloweesSearchService', [
	'FolloweeSearch', '$q',
	function(FolloweeSearch, $q) {
		this.query = function(params) {
			var deferred;
			deferred = $q.defer();
			FolloweeSearch.query(params, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		return this;
	}
]);