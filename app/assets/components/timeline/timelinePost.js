'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.timeline
 * @description show the list of events happen in community.
 * @restrict AE
 */
angular.module('hearth.directives').directive('timelinePost', function () {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      item: '=',
      isActive: '='

    },
    templateUrl: 'assets/components/timeline/timelinePost.html',
    link: function (scope, el) {
      // scope.isActive=true;

    }
  };
});

