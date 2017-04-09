'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.timeline
 * @description show the list of events happen in community.
 * @restrict AE
 */
angular.module('hearth.directives').directive('timeline', function () {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      timelineItems: '='
    },
    templateUrl: 'assets/components/timeline/timeline.html',
    link: function (scope, el) {
      scope.getIconType = item => {
        if (item.verb === 'community_accepted_user')
          return 'fa-user-o';
        if (item.verb === 'community_new_post')
          return 'fa-plus';
        if (item.verb === 'new_rating_received')
          console.log(JSON.stringify(item));
          return 'fa-sun-o';
      };

      scope.getRating = item => {
      }
    }
  };
});
