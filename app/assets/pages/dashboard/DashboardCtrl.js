'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.DashboardCtrl
 * @description Dashboard  controller
 */

angular.module('hearth.controllers').controller('DashboardCtrl', [
  '$scope', '$rootScope', 'Fulltext', 'User', 'HearthCrowdfundingBanner', 'PostAux', 'Interests',
  function ($scope, $rootScope, Fulltext, User, HearthCrowdfundingBanner,  PostAux, Interests) {

    $scope.epOpts = null;
    $scope.userOpts = null;
    $scope.loading = false;

    function init() {
      // init exemplary posts
      $scope.loading = true;

      if ($rootScope.loggedUser && $rootScope.loggedUser._id) {
        Interests.queryCurrentUser().then(function (interests) {
          Fulltext.query({ limit:5, days:10, type:'post', keywords_operator: 'OR', keywords: interests.join(',')}).$promise.then(function (result) {
            result.data = result.data.filter(function (item) {
              if (item.author._id == $rootScope.loggedUser._id) return false; else return true;
            })
            var uOpts = angular.copy(PostAux.getRecommendedPostsOpts(result.data));
            uOpts.found = {
              recommended: (result.data.length)
            }
            $scope.userOpts = uOpts;
          });
        })
      }

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
      

      // fetch blogposts
      HearthCrowdfundingBanner.initBlogposts().then((blogposts) => {
        $scope.blogposts = blogposts;
      })
    }

    init();
  }
]);
