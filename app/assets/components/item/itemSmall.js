'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.itemSmall
 * @description small item bow with settable template
 * @restrict AE
 */
angular.module('hearth.directives').directive('itemSmall', ['$rootScope', function ($rootScope) {

  const templates = {
    condensed: 'assets/components/item/itemCondensed.html',
    default: 'assets/components/item/itemSmall.html'
  }

  return {
    restrict: 'AE',
    scope: {
      item: '='
    },
    templateUrl: (el, attrs) => {
      return attrs.type && templates[attrs.type] ? templates[attrs.type] : templates.default
    },
    controllerAs: 'ctrl',
    controller: ['$scope', '$window', 'PostUtils', 'ItemAux', 'Rights', function($scope, $window, PostUtils, ItemAux, Rights) {

      const ctrl = this

      ctrl.postTypes = $window.$$config.postTypes
      ctrl.isPostActive = ItemAux.isPostActive
      ctrl.userHasRight = Rights.userHasRight
      ctrl.logPostTextToggle = ItemAux.logPostTextToggle

      $scope.$watch('item', newItem => {
        ctrl.item = newItem
        ItemAux.extendForDisplay(ctrl.item)
        ctrl.item.postTypeCode = PostUtils.getPostTypeCode(newItem.author._type, newItem.type, newItem.exact_type)
      })

    }]
  }

}])