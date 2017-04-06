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
    transclude: true,
    scope: {
      timelineItems: '=',
    },
    templateUrl: 'assets/components/timeline/timeline.html',
    link: function (scope, el) {

    }
  };
});
