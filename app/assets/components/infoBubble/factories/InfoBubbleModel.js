angular.module('hearth.directives').factory('InfoBubbleModel', ['ProfileUtils', function(ProfileUtils) {

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