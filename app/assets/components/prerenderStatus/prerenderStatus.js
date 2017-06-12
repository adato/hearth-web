'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.prerenderStatus
 * @description
 * @restrict AE
 */

angular.module('hearth.directives').directive('prerenderStatus', ['PrerenderService', function(PrerenderService) {
  return {
    restrict: 'AE',
    scope: {
    },
    template: '<meta name="prerender-status-code" content="{{vm.status.statusCode}}" ng-if="vm.allowedStatuses[vm.status.statusCode]">',
    controllerAs: 'vm',
    link: function(scope, element, attrs) {
      const vm = this
      vm.allowedStatuses = {
        '404' : true
      }
      vm.status = PrerenderService
    }
  };
}]);
