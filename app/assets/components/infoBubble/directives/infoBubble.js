'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.infoBubble
 * @description Directive that creates an information bubble on hover next to an element
 * @restrict A
 */

angular.module('hearth.directives').directive('infoBubble', ['$timeout', '$window', '$document', '$compile', '$rootScope', '$templateCache', 'InfoBubbleSetup',
  function ($timeout, $window, $document, $compile, $rootScope, $templateCache, InfoBubbleSetup) {

    return {
      restrict: 'A',
      scope: {
        infoBubble: '=',
        infoBubbleType: '='
      },
      link: function (scope, element, attrs, ctrl) {

        element.on('mouseenter', function () {
          // should remove all waiting and show one
          InfoBubbleSetup.cancelIntents();
          InfoBubbleSetup.setIntent({ 
            model: scope.infoBubble, 
            type: scope.infoBubbleType, 
            element: element[0]
          });
        })
        element.on('mouseleave', function () {
          InfoBubbleSetup.hideBubble();
        })

      }
    }
  }
])
