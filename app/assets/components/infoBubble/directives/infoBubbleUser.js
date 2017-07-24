angular.module('hearth.directives').directive('infoBubbleUser', [function() {

  return {
    restrict: 'E',
    templateUrl: 'assets/components/infoBubble/templates/infoBubbleUser.html',
    scope: {},
    bindToController: {
      model: '='
    },
    controllerAs: 'vm',
    controller: ['UsersService', '$rootScope', '$q', function(UsersService, $rootScope, $q) {

      const ctrl = this


      ctrl.$onInit = () => {

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
          })
        }

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