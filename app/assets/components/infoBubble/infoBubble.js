'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.infoBubble
 * @description Directive that creates an information bubble on hover next to an element
 * @restrict A
 */

angular.module('hearth.directives').directive('infoBubble', ['ViewportUtils', '$timeout', '$window', '$document', '$compile', '$rootScope', 'InfoBubbleModel', '$templateCache', 'Throttle', function(ViewportUtils, $timeout, $window, $document, $compile, $rootScope, InfoBubbleModel, $templateCache, Throttle) {

  const INFO_BUBBLE_SELECTOR = '[info-bubble-focusser]'
  const INTENT_DELAY = 300
  const INTENT_HIDE_DELAY = 300
  const BUBBLE_MARGIN = 10

  const validTypes = {
    user: 'User',
    location: 'Location'
  }

  var intent
  var hideIntent

  var bubbleElement
  var hoveredElement
  var bubbleScope

	return {
		restrict: 'A',
		scope: {},
    bindToController: {
			infoBubble: '=',
      infoBubbleType: '@'
		},
    controllerAs: 'vm',
    controller: [function() {

      const ctrl = this

      ctrl.$onInit = () => {
        ctrl.bubble = InfoBubbleModel
      }

    }],
		link: function(scope, element, attrs, ctrl) {

      element.on('mouseenter', initIntent.bind(null, { ctrl, type: attrs.infoBubbleType, element }))
      element.on('mouseleave', cancelIntent.bind(null, { ctrl }))

    }
  }

  //////////////////

  function show({ ctrl, type, element }) {

    $timeout.cancel(cancelIntent)
    if (InfoBubbleModel.shown) return

    // make sure the bubble element exists
    getBubble(type)

    if (ctrl) InfoBubbleModel.model = ctrl.infoBubble
    element.after(bubbleElement)
    InfoBubbleModel.shown = true
    InfoBubbleModel.opacity = 0

    $timeout(() => positionBubble(element))

  }

  function positionBubble(element) {
    const rpp = findRelativePositionParent(element[0])
    const rppBb = rpp.getBoundingClientRect()

    const bb = element[0].getBoundingClientRect()

    const windowWidth = Math.max($document[0].documentElement.clientWidth, $window.innerWidth || 0)
    const offsetLeft = (bb.right + BUBBLE_MARGIN - rppBb.left)

    // doesn't work, don't know why
    const bubbleWidth = bubbleElement.getBoundingClientRect().width// || 300

    const positionOnRight = (bb.right + bubbleWidth + BUBBLE_MARGIN) > windowWidth ? false : true

    InfoBubbleModel.position.top = (bb.top - rppBb.top) + 'px'
    if (positionOnRight) {
      InfoBubbleModel.position.left = offsetLeft + 'px'
    } else {
      InfoBubbleModel.position.left = (bb.left - bubbleWidth - BUBBLE_MARGIN) + 'px'
    }

    InfoBubbleModel.opacity = 1
  }

  function findRelativePositionParent(el) {
    if (!el) return $document[0].body
    while (el && el !== $document[0].body && (['relative', 'absolute', 'fixed'].indexOf($window.getComputedStyle(el).getPropertyValue('position')) === -1)) el = el.parentNode
    return el
  }

  function hide() {
    InfoBubbleModel.shown = false
    if (!$rootScope.$$phase) $rootScope.$apply()
  }

  function initIntent(argObject) {

    if (argObject.element[0] === hoveredElement) {
      hoveredElement = argObject.element[0]
      $timeout.cancel(hideIntent)
    }

    intent = $timeout(show.bind(null, argObject), INTENT_DELAY)
  }

  function cancelIntent() {
    $timeout.cancel(intent)
    hideIntent = $timeout(hide, INTENT_HIDE_DELAY)
  }

  /**
   * Creates the html element of a bubble, if it has not been created yet
   */
  function getBubble(type) {
    if (!validTypes[type]) throw new TypeError(`Invalid info bubble type: ${type}`)

    if (bubbleElement) return bubbleScope.type = validTypes[type]

    bubbleElement = $document[0].querySelector(INFO_BUBBLE_SELECTOR)
    if (bubbleElement) return bubbleScope.type = validTypes[type]

    bubbleScope = $rootScope.$new(true)
    bubbleScope.bubble = InfoBubbleModel
    bubbleScope.type = validTypes[type]
    angular.element($document[0].body).append($compile($templateCache.get(`assets/components/infoBubble/infoBubbleWrapper.html`))(bubbleScope))

    bubbleElement = $document[0].querySelector(INFO_BUBBLE_SELECTOR)

    bindEvents($document[0].querySelector(INFO_BUBBLE_SELECTOR))
  }

  function bindEvents(bubble) {
    if (!bubble) throw new TypeError('Bubble has to be a DOM Node. Got:', bubble)
    bubble = angular.element(bubble)

    bubble.on('mouseenter', () => $timeout.cancel(hideIntent))
    bubble.on('mouseleave', cancelIntent)
  }

}])