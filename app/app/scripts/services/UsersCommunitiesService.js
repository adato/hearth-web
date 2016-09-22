'use strict';

/**
 * @ngdoc factory
 * @name hearth.services.UsersCommunitiesService
 * @description Functions serving both user and community objects
 */

angular.module('hearth.services').factory('UsersCommunitiesService', [
	'$q', 'CommunityMemberships', '$rootScope', 'User', 'Community',
	function($q, CommunityMemberships, $rootScope, User, Community) {

		var postType = {
			offered: 'offered',
			needed: 'needed'
		}

		var factory = {
			alterPossiblePosts: alterPossiblePosts
			loadProfileInfo: loadProfileInfo
			query: query,
		};

		return factory;

		///////////////////

		/**
		 *	@param {Object} posts	- {Array} needed
		 *							- {Array} offered
		 */
		function alterPossiblePosts(posts, headers) {
			if (!posts.needed || !posts.offered) {
				return $log.error('Undefined needed/offered posts: ', posts, headers)
			}
			var arr = [];
			res.needed.forEach(function(item) {
				item.post_type = ((item.owner_id === $scope.loggedUser._id) ? postType.needed : postType.offered);
				arr.push(item);
			});
			res.offered.forEach(function(item) {
				item.post_type = ((item.owner_id === $scope.loggedUser._id) ? postType.offered : postType.needed);
				arr.push(item);
			});
			return arr;
		}

		function loadProfileInfo(author, done, doneErr) {
			var Resource = (author._type == 'User') ? User : Community;

			if ($rootScope.cacheInfoBox[author._id])
				return done($rootScope.cacheInfoBox[author._id]);

			Resource.get({
				_id: author._id
			}, function(info) {
				$rootScope.cacheInfoBox[author._id] = info;
				done(info);
			}, doneErr);
		};

		function query(params) {
			var deferred;
			deferred = $q.defer();
			CommunityMemberships.query(params, function(data) {
				return deferred.resolve(data);
			}, function(err) {
				return deferred.reject(err);
			});
			return deferred.promise;
		};

	}
]);