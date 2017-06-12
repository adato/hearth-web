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
    template: '<meta name="prerender-status-code" content="{{vm.status.statusCode}}" ng-if="vm.allowedStatuses[vm.status.statusCode]" />',
    controllerAs: 'vm',
    controller: [function() {

      const vm = this

      vm.status = PrerenderService
      vm.allowedStatuses = {
        '404' : true
      }

    }]
  }

}])