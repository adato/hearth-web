'use strict';

/**
 * @ngdoc factory
 * @name hearth.services.UsersCommunitiesService
 * @description Functions serving both user and community objects
 */

angular.module('hearth.services').factory('UsersCommunitiesService', [
	'$q', 'CommunityMemberships', '$rootScope', 'User', 'Community', '$log',
	function($q, CommunityMemberships, $rootScope, User, Community, $log) {

		const postType = {
			offered: 'offered',
			needed: 'needed'
		}

		const factory = {
			alterPossiblePosts: alterPossiblePosts,
			isMyCommunity: isMyCommunity,
			loadProfileInfo: loadProfileInfo,
			query: query,
		}

		return factory

		///////////////////

		/**
		 *	@param {Object} posts	- {Array} needed
		 *							- {Array} offered
		 */
		function alterPossiblePosts(posts, headers) {
			if (!posts.needed || !posts.offered) {
				return $log.error('Undefined needed/offered posts: ', posts, headers)
			}
			var arr = posts.needed.concat(posts.offered)
			return arr
		}

		/**
		 *	Returns whether I am an admin in the given community or not
		 *	@param {Object} communityObject - the community object that has an _id to check
		 *	@param {Object} params - {Boolean} checkIfIAmAdmin - check wheter I am an admin in the given community
		 *	@return {Boolean} true if I am a member/admin in the given community
		 */
		function isMyCommunity(communityObject, params) {
			params = params || {}
			if (communityObject && communityObject._id) {
				var communityList = params.checkIfIAmAdmin ? $rootScope.myAdminCommunities : $rootScope.myCommunities
				if (!communityList || !communityList.length) return false;
				for (var i = communityList.length; i--;) {
					if (communityList[i]._id === communityObject._id) return true
				}
			}
			return false
		}

		function loadProfileInfo(author, done, doneErr) {
			var Resource = (author._type == 'User') ? User : Community

			if ($rootScope.cacheInfoBox[author._id]) return done($rootScope.cacheInfoBox[author._id])

			Resource.get({
				_id: author._id
			}, function(info) {
				$rootScope.cacheInfoBox[author._id] = info
				done(info)
			}, doneErr)
		}

		function query(params) {
			var deferred
			deferred = $q.defer()
			CommunityMemberships.query(params, function(data) {
				return deferred.resolve(data)
			}, function(err) {
				return deferred.reject(err)
			})
			return deferred.promise
		}

	}
])