'use strict';

/**
 * @ngdoc constant
 * @name hearth.constants.InfoBubbleSetup
 * @description Object that is supposed to be set in app.config
 *              * templatesUrl {String} - template string for the infobubble. e.g. `/templates/templateFor${typeMap.key}.html`
 *              * typeMap {Object} - serves to match type of bubble with it's template
 */

angular.module('hearth.constants').constant('InfoBubbleSetup', {

  templateGet: angular.identity,
  typeMap: {}

})