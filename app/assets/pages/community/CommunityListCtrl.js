'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.CommunityListCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityListCtrl', [
	'$scope', '$rootScope', 'Community', 'CommunityMemberships', 'Auth', '$state', '$filter', 'UniqueFilter', 'Fulltext', 'PostAux', '$sce', 'ProfileUtils',
	function($scope, $rootScope, Community, CommunityMemberships, Auth, $state, $filter, UniqueFilter, Fulltext, PostAux, $sce, ProfileUtils) {
    var vm = this;
    vm.list = [];
    vm.myCommunities;
    var ItemFilter = new UniqueFilter();

		vm.finishLoading = function (res) {
			console.log("done")
		}


    vm.getSearchOpts = () => {
      var templatePath = 'assets/components/post/posts/post.html';
      var templateUrl = $sce.getTrustedResourceUrl(templatePath);
			vm.communityGiftListOptions = {
        getData: Community.getRelatedPosts,
        templateUrl: templateUrl,
				inactivateTags: true,
        cb: vm.finishLoading,
      };
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
