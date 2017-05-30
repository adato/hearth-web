'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityListCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityListCtrl', [
	'$scope', '$rootScope', 'Community', 'CommunityMemberships', 'UnauthReload', '$state', '$filter', 'UniqueFilter',
	function($scope, $rootScope, Community, CommunityMemberships, UnauthReload, $state, $filter, UniqueFilter) {
    var vm = this;
    vm.myCommunities;
    vm.showColumns = true;
		$scope.list = [];
		$scope.loading = false;
		$scope.loadingFinished = false;
		var ItemFilter = new UniqueFilter();

		$scope.load = function() {
      if ($scope.loadingFinished || $scope.loading) return false;

      // my communities are loaded in BaseCtrl after login
      if($state.current.name == 'communities.my') {
        vm.myCommunities = true;
        vm.showColumns = false;
        $scope.list = $rootScope.myCommunities;
        $scope.$parent.loadedFirstBatch = true;
        $scope.loadingFinished = true;
        return;
      }

      $scope.loading = true;
			var conf = {
				limit: 20,
				offset: $scope.list.length
			};

			var service = ($state.current.name == 'communities.suggested') ? Community.suggested : Community.query;
			service(conf, function(res) {

				if (res) {
					res = ItemFilter.filter(res);

					res.forEach(function(item) {
						item.description = $filter('ellipsis')($filter('linky')(item.description, '_blank'));
					});
				}
				$scope.list = $scope.list.concat(res);
        $scope.loading = false;
				$scope.$parent.loadedFirstBatch = true;
				if (!res.length || $state.current.name == 'communities.suggested') {
					return $scope.loadingFinished = true;
				}
			});
		};

		$scope.load();
	}
]);
