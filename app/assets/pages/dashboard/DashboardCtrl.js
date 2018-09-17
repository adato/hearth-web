'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.DashboardCtrl
 * @description Dashboard  controller
 */

angular.module('hearth.controllers').controller('DashboardCtrl', [
  '$scope', '$rootScope', 'Post', '$location', '$q', '$translate', '$timeout', 'Filter', '$templateCache', '$templateRequest', '$sce', '$compile', 'HearthCrowdfundingBanner', '$log', '$state', 'InfiniteScrollPagination', 'ScrollService', 'PostScope', 'MarketPostCount', 'Auth', 'PostAux', 'Rights',
  function ($scope, $rootScope, Post, $location, $q, $translate, $timeout, Filter, $templateCache, $templateRequest, $sce, $compile, HearthCrowdfundingBanner, $log, $state, InfiniteScrollPagination, ScrollService, PostScope, MarketPostCount, Auth, PostAux, Rights) {

    $scope.epOpts = null;
    $scope.loading = false;

    function init() {
      // init exemplary posts
      $scope.loading = true;
      PostAux.getExemplaryPosts().then(function (data) {
        $scope.loading = false;
        var epOpts = new PostAux.getExemplaryPostsOpts(data)
        $scope.epOpts = epOpts;
      }, function (error) {
        console.error(error);
      })
      

      // fetch blogposts
      HearthCrowdfundingBanner.initBlogposts().then((blogposts) => {
        $scope.blogposts = blogposts;
      })
    }

    init();
  }
]);
