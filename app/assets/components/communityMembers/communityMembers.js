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
			controller: ['CommunityMembers', '$scope', '$rootScope', function (CommunityMembers, $scope, $rootScope) {
				var vm = this;
				vm.members = [];
				vm.moreMembers = 0;

				$scope.count = parseInt($scope.count) || 8;
				if (!$scope.community || !$scope.community._id) return;

				CommunityMembers.query({ communityId: $scope.community._id, limit: $scope.count, offset: 0 }).$promise.then(function (res) {
					vm.members = res;
//					if ($rootScope.loggedUser && $rootScope.loggedUser._id && $rootScope.loggedUser._id == $scope.community.admin) res.push($rootScope.loggedUser)

					if ($scope.community && $scope.community.member_count && $scope.community.member_count > res.length) {
						vm.moreMembers = $scope.community.member_count - res.length;
					}
				});

			}],
			controllerAs: 'vm',
			scope: {
				count: "=",
				community: "=",
			},
			templateUrl: 'assets/components/communityMembers/communityMembers.html',
			link: function(scope, baseElement) {
			}
		};
	}
]);