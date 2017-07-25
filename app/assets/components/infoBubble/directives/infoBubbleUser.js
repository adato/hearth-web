angular.module('hearth.directives').directive('infoBubbleUser', [function() {

  return {
    restrict: 'E',
    templateUrl: 'assets/components/infoBubble/templates/infoBubbleUser.html',
    scope: {},
    bindToController: {
      model: '='
    },
    controllerAs: 'vm',
    controller: ['UsersService', '$rootScope', '$q', '$locale', function(UsersService, $rootScope, $q, $locale) {

      const ctrl = this


      ctrl.$onInit = () => {

        ctrl.pluralCat = $locale.pluralCat

        ctrl.sendingFollowRequest
        ctrl.toggleFollowUser = toggleFollowUser

        init()

      }

      /////////////////

      function init() {
        if (!ctrl.model.infoBubble) {
          $q.all({
            userDetail: UsersService.get(ctrl.model._id)
          })
          .then(res => {
            ctrl.model.infoBubble = res.userDetail
            initDone()
          }).catch(err => {
            console.log('error loading user detail', err);
          }).finally(() => {
            ctrl.detailLoaded = true
          })
        } else {
          initDone()
        }

      }

      function initDone() {
        if (ctrl.model.infoBubble.recent_images.length || ctrl.model.infoBubble.post_count.offers || ctrl.model.infoBubble.post_count.needs) {
          ctrl.moreAvailable = true
        }
        ctrl.detailLoaded = true
      }

      function toggleFollowUser({ userId, follow }) {
        if (ctrl.sendingFollowRequest) return
        ctrl.sendingFollowRequest = true

        UsersService[follow ? 'addFollower' : 'removeFollower'](userId, $rootScope.loggedUser._id).then(res => {
          if (follow) {
            ctrl.model.is_followee = true
          } else {
            ctrl.model.is_followee = false
          }
        }).catch(err => {
          console.log('error adding user to follow list')
        }).finally(() => {
          ctrl.sendingFollowRequest = false
        })
      }

    }]
  }

}])