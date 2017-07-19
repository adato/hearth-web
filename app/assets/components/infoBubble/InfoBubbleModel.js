angular.module('hearth.directives').factory('InfoBubbleModel', [function() {

  const factory = {
    shown: false,
    opacity: 0,
    position: {
      top: null,
      left: null
    },
    model: {}
  }

  return factory

  //////////////

}])