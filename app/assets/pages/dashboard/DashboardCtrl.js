'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.DashboardCtrl
 * @description Dashboard  controller
 */

angular.module('hearth.controllers').controller('DashboardCtrl', [
  '$scope', '$rootScope', 'Fulltext', 'User', 'HearthCrowdfundingBanner', 'PostAux', 'Interests', 'Ratings',
  function ($scope, $rootScope, Fulltext, User, HearthCrowdfundingBanner,  PostAux, Interests, Ratings) {

    $scope.epOpts = null;
    $scope.userOpts = null;
    $scope.friendsOpts = null;
    $scope.nonMassOpts = null;
    $scope.loading = false;
    $scope.lastRatings = null;
    $scope.lastRatingsPage = 1;
    $scope.selectedTab = null;

    $scope.setTab = function (tab) {
      $scope.selectedTab = tab;
      $scope.loading = true;

      if (tab == 'popular') initPopular();
      if (tab == 'info') initInfo();
      if (tab == 'ratings') initRatings();
      
      if ($rootScope.loggedUser && $rootScope.loggedUser._id) {
        if (tab == 'friends') initFriends();
        //if (tab == 'recommended') initRecommended();
      }
    }

    function initPopular() {
      $scope.epOpts = null;
      PostAux.getExemplaryPosts().then(function (data) {
        $scope.loading = false;
        var epOpts = new PostAux.getExemplaryPostsOpts(data)
        epOpts.found = {
          posts: (data.main.length + data.additional.length)
        }
        $scope.epOpts = epOpts;
      }, function (error) {
        console.error(error);
      })
    }

    function initRecommended() {
      $scope.userOpts = null;
      Interests.queryCurrentUser().then(function (interests) {
        Fulltext.query({ limit:5, days:10, type:'post', keywords_operator: 'OR', keywords: interests.join(',')}).$promise.then(function (result) {
          result.data = result.data.filter(function (item) {
            if (item.author._id == $rootScope.loggedUser._id) return false; else return true;
          })
          var uOpts = angular.copy(PostAux.getPostsOpts(result.data));
          uOpts.found = {
            recommended: (result.data.length)
          }
          $scope.loading = false;
          $scope.userOpts = uOpts;
        });
      });
    }

    function initInfo() {
      /// get non mass posts
      $scope.nonMassOpts = null;
      Fulltext.query({ limit:20, days:20, type:'post', character: ['information','energy', 'information,energy']}).$promise.then(function (result) {
        result.data = result.data.filter(function (item) {
          if (item.author._id == $rootScope.loggedUser._id) return false; else return true;
        })
        var xOpts = angular.copy(PostAux.getPostsOpts(result.data));
        //console.log("fopts", xOpts)
        xOpts.found = {
          info: (result.data.length)
        }
        $scope.loading = false;
        $scope.nonMassOpts = xOpts;
      });
    }

    function initFriends() {
      /// get friends posts
      $scope.friendsOpts = null;
      Fulltext.query({ limit:20, days:60, type:'post', my_section: true }).$promise.then(function (result) {
        result.data = result.data.filter(function (item) {
          if (item.author._id == $rootScope.loggedUser._id) return false; else return true;
        })
        var yOpts = angular.copy(PostAux.getPostsOpts(result.data));
        yOpts.found = {
          friends: (result.data.length)
        }
        $scope.loading = false;
        $scope.friendsOpts = yOpts;
      });
    }

    function initRatings() {
      Ratings.list().$promise.then(function (result) {
        $scope.loading = false;
        $scope.lastRatings = result;
      });
    }

    $scope.loadMoreRatings = function() {
      if ($scope.selectedTab != 'ratings') return;
      $scope.loading = true;
      Ratings.list({ page: ++$scope.lastRatingsPage }).$promise.then(function (result) {
        $scope.loading = false;
        $scope.lastRatings = $scope.lastRatings.concat(result);
      });
    }


    function init() {
      // init exemplary posts
      $scope.loading = true;
      $scope.setTab('popular');
     
      // // fetch blogposts
      // HearthCrowdfundingBanner.initBlogposts().then((blogposts) => {
      //   $scope.blogposts = blogposts;
      // })
    }

    init();
  }
]);
