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

      ctrl.item = $scope.item
      extend(ctrl.item)

      ctrl.postTypes = $window.$$config.postTypes
      ctrl.isPostActive = ItemAux.isPostActive
      ctrl.userHasRight = Rights.userHasRight
      ctrl.logPostTextToggle = ItemAux.logPostTextToggle

      $scope.$watch('ctrl.item', extend)

      function extend(item) {
        if (!item) return
        ctrl.item = item
        ItemAux.extendForDisplay(item)
        item.postTypeCode = PostUtils.getPostTypeCode(item.author._type, item.type, item.exact_type)
      }

    }]
  }

}])