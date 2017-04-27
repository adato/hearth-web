'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.timeline
 * @description show the list of events happen in community.
 * @restrict AE
 */
angular.module('hearth.directives').directive('timeline',['$rootScope', function ($rootScope) {

  return {
    restrict: 'E',
    scope: {
      timelineItems: '=',
      loadNext: '&'
    },
    templateUrl: 'assets/components/timeline/timeline.html',
    link: function (scope, el) {

      scope.getProfileLink = $rootScope.getProfileLink;

      scope.getIconType = item => {
        if (item.verb === 'community_accepted_user')
          return 'fa-user-o';
        if (item.verb === 'group' && item.type === 'community_accepted_user')
          return 'fa-user-o';
        if (item.verb === 'community_new_post' || item.verb === 'new_post')
          return 'fa-plus';
        if (item.verb === 'new_rating_received' || item.verb === 'new_rating')
          return item.object.score == -1 ? 'icon-rating-negative' : 'icon-rating-positive';
      };

    }
  };

}]);
