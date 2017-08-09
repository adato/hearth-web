'use strict';

/**
 * @ngdoc constant
 * @name hearth.constants.InfoBubbleSetup
 * @description Object that is supposed to be set in app.config
 *              * enabled {Boolean} whether the infobubble should be enabled or disabled
 *              * templatesUrl {String} - template string for the infobubble. e.g. `/templates/templateFor${typeMap.key}.html`
 *              * typeMap {Object} - serves to match type of bubble with it's template
 */

angular.module('hearth.constants').constant('InfoBubbleSetup', {

  /**
   *
   */
  enabled: true,

  /**
   *  will be called with typeMap.key as a first argument
   */
  templateGet: angular.identity,

  /**
   *  Glue between type and bubble template.
   *  Works in the following fashion:
   *  info-bubble-type="key" -> templateGet(typeMap[key.toLowerCase()])
   */
  typeMap: {}

})