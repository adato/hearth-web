'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.avatar
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('styleGetter', ['$window', '$timeout', '$document', function($window, $timeout, $document) {

  return {
    scope: {
      styleGetter: '@',
      styleToGet: '@'
    },
    link: function(scope, el, attrs) {
      $timeout(() => {
        if (!scope.styleToGet) return
        const targetElem = $document[0].querySelector(scope.styleGetter)
        if (!targetElem) return
        el[0].innerHTML = $window.getComputedStyle(targetElem).getPropertyValue(scope.styleToGet)
      })
    }
  }

}])