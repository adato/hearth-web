angular.module('hearth.directives').directive('infoBubbleCommunity', [function() {

  return {
    restrict: 'E',
    templateUrl: 'assets/components/infoBubble/templates/infoBubbleCommunity.html',
    scope: {},
    bindToController: {
      model: '='
    },
    controllerAs: 'vm',
    controller: ['Community', 'CommunityApplicants', '$q', '$locale', function(Community, CommunityApplicants, $q, $locale) {

      const ctrl = this


      ctrl.$onInit = () => {

        ctrl.pluralCat = $locale.pluralCat

        ctrl.sendingJionRequest
        ctrl.join = join

        init()

      }

      /////////////////

      function init() {

        if (!ctrl.model.infoBubble) {
          $q.all({
            communityDetail: Community.get({_id: ctrl.model._id})
          })
          .then(res => {
            ctrl.model.infoBubble = res.communityDetail
          })
        }

      }

      function join({ communityId }) {
        if (ctrl.sendingJoinRequest) return
        ctrl.sendingJoinRequest = true

        CommunityApplicants.add({ communityId }).$promise.then(res => {
          console.log('application sent', res);
          // what now?
        }).catch(err => {
          console.log('error sending community join request')
        }).finally(() => {
          ctrl.sendingJoinRequest = false
        })
      }

    }]
  }

}])