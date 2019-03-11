angular.module('hearth.directives').directive('infoBubbleCommunity', [function () {

  return {
    restrict: 'E',
    templateUrl: 'assets/components/infoBubble/templates/infoBubbleCommunity.html',
    scope: {},
    bindToController: {
      model: '='
    },
    controllerAs: 'vm',
    controller: ['Community', 'CommunityApplicants', '$q', '$locale', 'MottoLength', 'InfoBubbleCache',
      function (Community, CommunityApplicants, $q, $locale, MottoLength, InfoBubbleCache) {

        const ctrl = this

        ctrl.$onInit = () => {

          ctrl.pluralCat = $locale.pluralCat
          ctrl.sendingJionRequest
          ctrl.join = join

          init()
        }

        /////////////////
        function doneFunction(result) {
          var cacheKey = 'comm' + result.communityDetail._id;
          InfoBubbleCache.put(cacheKey, result);
          const about = result.communityDetail.short_description || result.communityDetail.description
          result.communityDetail.about_shortened = about ? (about.length > (MottoLength + 3) ? (about.substring(0, MottoLength) + '…') : about) : ''
          ctrl.model.infoBubble = result.communityDetail
          initDone()
        }

        function init() {
          var cachedResult;
          var cacheKey = 'comm' + ctrl.model._id;

          if (typeof (cachedResult = InfoBubbleCache.get(cacheKey)) != 'undefined') {
            return doneFunction(cachedResult);
          } else {
            $q.all({
              communityDetail: Community.get({
                _id: ctrl.model._id
              }).$promise
            }).then(doneFunction).catch(err => {
              console.log('error loading community detail', err);
            })
          }
        }

        function initDone() {
          ctrl.moreAvailable = true
          ctrl.detailLoaded = true
        }

        function join({ communityId }) {
          if (ctrl.sendingJoinRequest) return
          ctrl.sendingJoinRequest = true

          CommunityApplicants.add({
            communityId
          }).$promise.then(res => {
            ctrl.model.infoBubble = ctrl.model.infoBubble || {};
            ctrl.model.infoBubble.is_applicant = true;
            // what now?
          }).catch(err => {
            console.log('error sending community join request');
          }).finally(() => {
            ctrl.sendingJoinRequest = false;
          })
        }

      }
    ]
  }

}])
