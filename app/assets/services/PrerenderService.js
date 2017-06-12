'use strict';

/**
 * @ngdoc service
 * @name hearth.services.PrerenderService
 * @description
 */

angular.module('hearth.services').factory('PrerenderService', [ function() {

  const factory = {
    statusCode: null,
    setStatusCode
  }

  return factory

  //////////////

  function setStatusCode(code) {
    factory.statusCode = code
  }

}])