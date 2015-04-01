'use strict';

/**
 * @ngdoc service
 * @name hearth.services.UsersCommunitiesService
 * @description
 */
 
angular.module('hearth.services').service('UsersCommunitiesService', [
	'$q', 'CommunityMemberships', '$rootScope', 'User', 'Community', 
	function($q, CommunityMemberships, $rootScope, User, Community) {
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


		this.loadProfileInfo = function(author, done, doneErr) {
			var Resource = (author._type == 'User') ? User : Community;
			
			if($rootScope.cacheInfoBox[author._id])
				return done($rootScope.cacheInfoBox[author._id]);
			
			Resource.get({_id: author._id}, function(info) {
				$rootScope.cacheInfoBox[author._id] = info;
				done(info);
			}, doneErr);
		};

		return this;
	}
]);