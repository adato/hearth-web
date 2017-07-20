'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.bubble
 * @description Attribute that calls its function when its element gets visible in a viewport
 * @restrict A
 */

angular.module('hearth.directives').directive('actionWhenVisible', ['ViewportUtils', '$window', 'Throttle', function(ViewportUtils, $window, Throttle) {

	return {
		restrict: 'A',
		scope: {
			actionWhenVisible: '&'
		},
		link: function(scope, element, attrs) {

      var actionInited = false

      // bind watch and do an initial call
      const watcher = Throttle.go(actionIniter, 200)
			angular.element($window).on('scroll', watcher)
      actionIniter

      function actionIniter() {
        const isIn = ViewportUtils.isInViewport(element[0])
        if (!actionInited && isIn) {
          scope.actionWhenVisible()
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