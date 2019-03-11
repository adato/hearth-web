angular.module('hearth.services').service('InfoBubbleSetup', ['$templateCache', '$compile', '$rootScope', '$document', '$timeout',
function ($templateCache, $compile, $rootScope, $document, $timeout) {
  
  // only one infobubble can be shown at any time
  
  var template = $templateCache.get('assets/components/infoBubble/templates/infoBubbleWrapper.html');
  var compiledTemplate = null;
  var timeoutPromise;


  /**
   * Set timeout after which display the bubble
   */
  this.setIntent = function (param) {
    timeoutPromise = $timeout(function () {
      
      // hide bubbles first (without delay)
      hideFunction();

      // set up scope:
      var bubbleScope = $rootScope.$new(true);
      bubbleScope.model = param.model;
      bubbleScope.type = param.type;
      bubbleScope.getTemplate = function (type) {
        if (type.toLowerCase() === 'user') return 'assets/components/infoBubble/templates/infoBubbleUserWrapper.html';
        if (type.toLowerCase() === 'community') return 'assets/components/infoBubble/templates/infoBubbleCommunityWrapper.html';
      };

      compiledTemplate = $compile(template)(bubbleScope);
      if (param.element && !$document[0].querySelector("[bubble-wrapper]")) {
        // append element straight after origin element 
        angular.element(param.element)[0].append(compiledTemplate[0]);
      }

      reposition(param.element);

    }, 150);
  }

  /**
   * Public - Cancels all actions -> clear timers
   */
  this.cancelIntents = function () {
    $timeout.cancel(timeoutPromise);
  }

  /**
   * Private- Hides bubble -- remove it from DOM
   */
  function hideFunction() {
    if ($document[0].querySelector("[bubble-wrapper]")) {
      $document[0].querySelector("[bubble-wrapper]").remove();
    }
  }

  /**
   * Public - Hides bubble with timeout
   */
  this.hideBubble = function () {
    if (timeoutPromise) this.cancelIntents();
    timeoutPromise = $timeout(hideFunction, 500);
  }


  /** 
   * reposition bubble (by dom css manipulation)
   */
  function reposition(parentElement) {
    const XOFFSET = 100;
    const YOFFSET = -20;

    var bubbleObj = $document[0].querySelector("[bubble-wrapper]");
    var parentTop = parentElement.offsetTop;
    var parentLeft = parentElement.offsetLeft;
    var bubbleWidth = bubbleObj.offsetWidth;
    var documentWidth = $document[0].body.offsetWidth;
    bubbleObj.style.top = parentTop + YOFFSET + 'px';
    if (parentLeft + bubbleWidth + XOFFSET > documentWidth) {
      bubbleObj.style.left = (parentLeft - bubbleWidth - (XOFFSET / 5)) + "px";
    } else {
      bubbleObj.style.left = (parentLeft + XOFFSET) + "px";
    }
  }

}])