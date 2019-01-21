'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.myCommunities
 * @description shows list of my most-active communities
 * @restrict E
 */



angular.module('hearth.directives').directive('myCommunities', [
	function() {
		return {
			restrict: 'E',
			controller: ['CommunityMemberships', 'Community', '$rootScope', 'UserCommunitiesCache', '$q', function (CommunityMemberships, Community, $rootScope, UserCommunitiesCache, $q) {
				const DISPLAY_COUNT = 3;
				var vm = this;
				vm.loading = false;
				vm.communities = [];
				vm.userHasCommunities = false;

				function init() {
					if (typeof $rootScope.loggedUser == 'undefined') return;

					// if is in cache, return it
					var cachedResult = null;
					if (typeof (cachedResult = UserCommunitiesCache.get('by-number-of-posts')) != 'undefined') {
						vm.hasMoreCommunities = (cachedResult > DISPLAY_COUNT);
						vm.communities = cachedResult.slice(0, DISPLAY_COUNT);
						vm.userHasCommunities = cachedResult.length > 0;
						return;
					}
					CommunityMemberships.get({ user_id: $rootScope.loggedUser._id }).$promise.then(function (res) {
						vm.userHasCommunities = res.length > 0;
						var communities = [];
						var promises = res.map(function (communityItem) {
							return Community.get({ _id: communityItem._id }).$promise;
						});
						$q.all(promises).then(function (results) {
							// sort them by number of posts
							var tmpList = Object.values(results).sort(function (a, b) {
								var aposts = a.post_count.needs + a.post_count.offers;
								var bposts = b.post_count.needs + b.post_count.offers;
								if (aposts < bposts) return -1;
								if (aposts > bposts) return 1;
								return 0;
							}).reverse();
							vm.hasMoreCommunities = (tmpList.length > DISPLAY_COUNT);
							vm.communities = tmpList.slice(0, DISPLAY_COUNT);
							UserCommunitiesCache.put('by-number-of-posts', tmpList); // put to cache
						})
					}, function (err) {
					});
				}

				init();
			}],
			controllerAs: 'vm',
			scope: true,
			templateUrl: 'assets/components/myCommunities/myCommunities.html',
			link: function(scope, element, attrs) {
				
			}
		};
	}
]);