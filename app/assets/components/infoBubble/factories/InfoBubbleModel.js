angular.module('hearth.directives').factory('InfoBubbleModel', ['ProfileUtils', function(ProfileUtils) {

  const factory = {
    shown: false,
    opacity: 0,
    position: {
      top: null,
      left: null
    },

    // fn: {
    //   followUser: ProfileUtils.followUser,
    //   followUserLoading: false
    // },
    model: {}
  }

  return factory

  //////////////

}])