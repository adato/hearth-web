'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.bubble
 * @description Attribute that calls its function when its element gets visible in a viewport
 * @restrict A
 */

angular.module('hearth.directives').directive('actionWhenVisible', ['ViewportUtils', '$window', 'Throttle', '$timeout', function(ViewportUtils, $window, Throttle, $timeout) {

	return {
		restrict: 'A',
		// scope: {},
		link: function(scope, element, attrs) {

      var actionInited = false

      // bind watch and do an initial call
      const watcher = Throttle.go(actionIniter, 400)
			angular.element($window).on('scroll', watcher)
      $timeout(actionIniter, 1000)

      function actionIniter() {
        const isIn = ViewportUtils.isInViewport(element[0])
        if (!actionInited && isIn) {
          scope.$eval(attrs.actionWhenVisible)
          actionInited = true
        } else if (actionInited && !isIn) {
          actionInited = false
        }
      }

      scope.$on('$destroy', () => {
				angular.element($window).off('scroll', watcher)
      })

    }
  }

}])