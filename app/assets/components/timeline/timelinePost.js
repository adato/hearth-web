'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.timeline
 * @description show the list of events happen in community.
 * @restrict AE
 */
angular.module('hearth.directives').directive('timelinePost',['$rootScope', function ($rootScope) {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      item: '=',

    },
    templateUrl: 'assets/components/timeline/timelinePost.html',
    link: function (scope, el) {
      scope.isPostActive = (item) => {
        return $rootScope.isPostActive(item);
      }
    }
  };
}
]);

