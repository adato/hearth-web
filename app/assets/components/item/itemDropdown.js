'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.itemDropdown
 * @description action dropdown for posts
 * @restrict AE
 */
angular.module('hearth.directives').directive('itemDropdown', ['$rootScope', function ($rootScope) {

  return {
    restrict: 'AE',
    scope: {
      item: '=itemDropdown'
    },
    templateUrl: 'assets/components/item/itemDropdown.html',
    controllerAs: 'ctrl',
    controller: ['$scope', '$window', 'PostUtils', 'ItemAux', 'Rights', 'Bubble', 'LanguageList', function($scope, $window, PostUtils, ItemAux, Rights, Bubble, LanguageList) {

      const ctrl = this

      ctrl.item = $scope.item

      ctrl.postCharacter = $window.$$config.postCharacter

      ctrl.ItemAux = ItemAux
      ctrl.removeReminder = Bubble.removeReminder
      ctrl.userHasRight = Rights.userHasRight

      // TODO: all hail the great $rootScope, which is eternal, encompassing and shall save us all
      ctrl.confirmBox = $rootScope.confirmBox
      ctrl.followItem = $rootScope.followItem
      ctrl.unfollowItem = $rootScope.unfollowItem
      ctrl.pauseToggle = $rootScope.pauseToggle
      ctrl.removeItemFromCommunity = $rootScope.removeItemFromCommunity
      ctrl.openReportBox = $rootScope.openReportBox

      $scope.$watch('item', newItem => {
        ctrl.item = newItem

        ctrl.mine = ItemAux.isMyPost(ctrl.item)
        ctrl.isActive = $rootScope.isPostActive(ctrl.item)
        ctrl.postLanguage = LanguageList.translate(ctrl.item.language)
        ctrl.analytics = ev => ItemAux.logPostAction(ev, {mine: ctrl.mine, item: ctrl.item})
      })

    }]
  }

}])