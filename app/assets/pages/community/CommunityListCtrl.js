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
    vm.load = () => initMyCommunities();
		var ItemFilter = new UniqueFilter();

		var initCommunities = () => {

      if ($state.current.name == 'communities.my') {
        if ($rootScope.myCommunities.length) {
          vm.myCommunities = $rootScope.myCommunities.length;
          vm.showColumns = false;
          $scope.list = $rootScope.myCommunities;
          $scope.$parent.loadedFirstBatch = true;
          $scope.loadingFinished = true;
          $scope.loading = false;
        } else {
          // if there are not my communities, then default tab is suggested communities
          $state.go('communities.suggested');
        }
      } else {
        var conf = {
          limit: 20,
          offset: $scope.list.length
        };

        var service = ($state.current.name == 'communities.suggested') ? Community.suggested : Community.query;
        service(conf, function (res) {

          if (res) {
            res = ItemFilter.filter(res);

            res.forEach(function (item) {
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
      }
    };

    var initMyCommunities = () => {
      if ($scope.loadingFinished || $scope.loading) return false;
      $scope.loading = true;

      // my communities are loaded in BaseCtrl
      if ($rootScope.communitiesLoaded) {
        initCommunities()
      } else {
        // wait for load
        var listener = $rootScope.$watch('communitiesLoaded', function(val) {
          if (val) {
            initCommunities();
            listener();
          }
        });
      }
    };

    initMyCommunities();
	}
]);
