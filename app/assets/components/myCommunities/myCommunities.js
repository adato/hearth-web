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
			controller: ['CommunityMemberships', 'Community', '$rootScope', '$q', function (CommunityMemberships, Community, $rootScope, $q) {
				const DISPLAY_COUNT = 3;
				var vm = this;
				vm.loading = false;
				vm.communities = [];
				vm.userHasCommunities = false;

				function init() {
					if (typeof $rootScope.loggedUser == 'undefined') return;
					CommunityMemberships.get({ user_id: $rootScope.loggedUser._id }).$promise.then(function (res) {
						// sort them by number of 
						vm.userHasCommunities = res.length > 0;
						//vm.communities = res;
						var communities = [];
						var promises = res.map(function (communityItem) {
							return Community.get({ _id: communityItem._id }).$promise;
						});
						$q.all(promises).then(function (results) {
							var tmpList = Object.values(results).sort(function (a, b) {
								var aposts = a.post_count.needs + a.post_count.offers;
								var bposts = b.post_count.needs + b.post_count.offers;
								if (aposts < bposts) return -1;
								if (aposts > bposts) return 1;
								return 0;
							}).reverse();
							vm.hasMoreCommunities = (tmpList.length > DISPLAY_COUNT);
							vm.communities = tmpList.slice(0, DISPLAY_COUNT);
						})
					}, function (err) {
					})
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