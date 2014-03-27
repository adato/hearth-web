'use strict';

angular.module('hearth.services').service('UsersCommunitiesService', [
	'$q', 'CommunityMemberships',
	function($q, CommunityMemberships) {
		this.query = function(params) {
			var deferred;
			deferred = $q.defer();
			CommunityMemberships.query(params, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};
		return this;
	}
]);