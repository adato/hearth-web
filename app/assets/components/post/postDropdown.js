'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.postDropdown
 * @description action dropdown for posts
 * @restrict AE
 */
angular.module('hearth.directives').directive('postDropdown', ['$rootScope', function ($rootScope) {

  return {
    restrict: 'AE',
    scope: {
      item: '=postDropdown'
    },
    templateUrl: 'assets/components/post/postDropdown.html',
    controllerAs: 'ctrl',
    controller: ['$scope', '$window', 'PostAux', 'Rights', 'Bubble', 'LanguageList', function($scope, $window, PostAux, Rights, Bubble, LanguageList) {

      const ctrl = this

      ctrl.item = $scope.item

      ctrl.postCharacter = $window.$$config.postCharacter

      ctrl.PostAux = PostAux
      ctrl.removeReminder = Bubble.removeReminder
      ctrl.userHasRight = Rights.userHasRight

      // TODO: all hail the great $rootScope, which is eternal, encompassing and shall save us all
      ctrl.confirmBox = $rootScope.confirmBox
      ctrl.followItem = $rootScope.followItem
      ctrl.unfollowItem = $rootScope.unfollowItem
      ctrl.pauseToggle = $rootScope.pauseToggle
      ctrl.postRemoveFromCommunity = $rootScope.postRemoveFromCommunity
      ctrl.openReportBox = $rootScope.openReportBox

      const runOnce = $scope.$watch('item', newItem => {
        ctrl.item = newItem

        ctrl.mine = PostAux.isMyPost(ctrl.item)
        ctrl.isActive = PostAux.isPostActive(ctrl.item)
        ctrl.postLanguage = LanguageList.translate(ctrl.item.language)
        ctrl.analytics = ev => PostAux.logPostAction(ev, {mine: ctrl.mine, item: ctrl.item})

        runOnce()
      })

    }]
  }

}])