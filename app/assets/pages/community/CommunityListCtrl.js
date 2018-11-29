'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityListCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityListCtrl', [
	'$scope', '$rootScope', 'Community', 'CommunityMemberships', 'Auth', '$state', '$filter', 'UniqueFilter', 'Fulltext', 'PostAux',
	function($scope, $rootScope, Community, CommunityMemberships, Auth, $state, $filter, UniqueFilter, Fulltext, PostAux) {
    var vm = this;
    vm.list = [];
    vm.myCommunities;
    var ItemFilter = new UniqueFilter();

    vm.load = () => initCommunities();

    vm.getSearchOpts = () => {
      Fulltext.query({ limit:20, days:30, type:'post', my_section: true}).$promise.then(function (result) {
        result.data = result.data.filter(function (item) {
          if (item.author._id == $rootScope.loggedUser._id) return false; else return true;
        })
        var commOpts = angular.copy(PostAux.getRecommendedPostsOpts(result.data));
        
        commOpts.found = {
          communities: (result.data.length)
        }
        vm.commOpts = commOpts;
      }); 
    }

    vm.getAllCommunities = () => {
      var conf = {
        limit: 20,
        offset: vm.list.length
      };

      Community.query(conf, (res) => {
        if (res) {
          res = ItemFilter.filter(res);

          res.forEach(function (item) {
            item.description = $filter('ellipsis')($filter('linky')(item.description, '_blank'));
          });
        }
        vm.list = vm.list.concat(res);
      });
    }

    vm.loadMore = () => {
      vm.getAllCommunities();
    }

    var initCommunities = () => {  
      $rootScope.$on('communities:loaded', () => {
        vm.myCommunities = $rootScope.myCommunities
      });
      
      if (!vm.myCommunities || !vm.myCommunities.length) $rootScope.$emit('reloadCommunities');
      vm.getSearchOpts();
    };

    
    if ($state.current.name == 'communities-all') {
      vm.getAllCommunities();
    } else {
      initCommunities() 
    }
  }
]);
