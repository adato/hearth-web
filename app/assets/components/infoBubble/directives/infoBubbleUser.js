angular.module('hearth.directives').directive('infoBubbleUser', [function () {

  return {
    restrict: 'E',
    templateUrl: 'assets/components/infoBubble/templates/infoBubbleUser.html',
    scope: {},
    bindToController: {
      model: '='
    },
    controllerAs: 'vm',
    controller: ['UsersService', '$rootScope', '$q', '$locale', 'MottoLength', 'InfoBubbleCache',
      function (UsersService, $rootScope, $q, $locale, MottoLength, InfoBubbleCache) {
        
        const ctrl = this
        const USER_FOLLOWED_EMIT_ID = 'user-followed'
        

        ctrl.$onInit = () => {
          ctrl.pluralCat = $locale.pluralCat
          ctrl.loggedUser = $rootScope.loggedUser

          ctrl.sendingFollowRequest
          ctrl.toggleFollowUser = toggleFollowUser

          init()
        }

        /////////////////
        function doneFunction(result) {
          var cacheKey = 'user' + result.userDetail._id;
          InfoBubbleCache.put(cacheKey, result);
          const about = result.userDetail.about || result.userDetail.motto;
          result.userDetail.about_shortened = about ? (about.length > (MottoLength + 3) ? (about.substring(0, MottoLength) + '…') : about) : ''
          ctrl.model.infoBubble = result.userDetail
          initDone()
        }

        function init() {
          var cachedResult;
          var cacheKey = 'user' + ctrl.model._id;
          
          if (typeof (cachedResult = InfoBubbleCache.get(cacheKey)) != 'undefined') {
            return doneFunction(cachedResult);
          } else {
            $q.all({
              userDetail: UsersService.get(ctrl.model._id)
            }).then(doneFunction).catch(err => {
              console.log('error loading user detail', err)
            })
          }
        }

        function initDone() {
          ctrl.moreAvailable = true
          ctrl.detailLoaded = true
          $rootScope.$on(USER_FOLLOWED_EMIT_ID, setFollowStatus)

        }

        function toggleFollowUser({
          userId,
          follow
        }) {
          if (ctrl.sendingFollowRequest) return
          ctrl.sendingFollowRequest = true

          UsersService[follow ? 'addFollower' : 'removeFollower'](userId, $rootScope.loggedUser._id).then(res => {
            ctrl.model.infoBubble = ctrl.model.infoBubble || {}
            ctrl.model.infoBubble.is_followed = !!follow

            $rootScope.$emit(USER_FOLLOWED_EMIT_ID, {
              id: ctrl.model._id,
              status: !!follow
            })
          }).catch(err => {
            console.log('error adding user to follow list')
          }).finally(() => {
            ctrl.sendingFollowRequest = false
          })
        }

        function setFollowStatus(event, {
          id,
          status
        } = {}) {
          if (!(ctrl.model._id === id && ctrl.model.infoBubble && status !== void 0)) return
          ctrl.model.infoBubble.is_followed = status
        }

      }
    ],
    link: function () {}
  }
}])
