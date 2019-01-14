'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.communityMembers
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('communityMembers', [
	'$rootScope', '$timeout', 'Communities',
	function($rootScope, $timeout, Communities) {
		return {
			restrict: 'E',
			replace: true,
			controller: ['CommunityMembers', '$scope', '$state', function (CommunityMembers, $scope, $state) {
				var vm = this;
				vm.members = [];
				vm.moreMembers = 0;

				$scope.count = parseInt($scope.count) || 8;
				if (!$scope.community || !$scope.community._id) return;

				CommunityMembers.query({ communityId: $scope.community._id, limit: $scope.count * 3, offset: 0 }).$promise.then(function (res) { // scope.count*3 ==> we need more results because of deactivated users
					
					let members = res.filter((member) => { return (!member.deactivated) });
					vm.members = members.slice(0, $scope.count);
//					if ($rootScope.loggedUser && $rootScope.loggedUser._id && $rootScope.loggedUser._id == $scope.community.admin) res.push($rootScope.loggedUser)

					if ($scope.community && $scope.community.member_count && $scope.community.member_count > res.length) {
						vm.moreMembers = $scope.community.member_count - res.length;
					}
				});

				
				vm.navigateToMembers = function() {
					if ($scope.moreLinkHref) {
						$state.go($scope.moreLinkHref, { id: $scope.community._id });
					}
				}

			}],
			controllerAs: 'vm',
			scope: {
				count: "=",
				community: "=",
				moreLinkHref: "=",
			},
			templateUrl: 'assets/components/communityMembers/communityMembers.html',
			link: function(scope, baseElement) {
			}
		};
	}
]);