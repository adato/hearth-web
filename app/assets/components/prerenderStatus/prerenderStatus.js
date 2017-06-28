'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.prerenderStatus
 * @description
 * @restrict AE
 */

angular.module('hearth.directives').directive('prerenderStatus', ['PrerenderService', function(PrerenderService) {

  return {
    restrict: 'A',
    link: function(scope, el, attrs) {

      const allowedStatuses = {
        '404' : true
      }
      const metaAttrs = 'name="prerender-status-code"'

      scope.$watch(function() {
        return PrerenderService.statusCode
      }, newValue => {
        if (allowedStatuses[newValue]) {
          el.append(`<meta ${metaAttrs} content="${newValue}" />`)
        } else {
          el.find(`meta[${metaAttrs}]`).remove()
        }
      })

    }
  }

}])