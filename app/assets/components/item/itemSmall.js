'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.timeline
 * @description show the list of events happen in community.
 * @restrict AE
 */
angular.module('hearth.directives').directive('itemSmall', ['$rootScope', function ($rootScope) {

  const templates = {
    condensed: 'assets/components/item/itemCondensed.html',
    default: 'assets/components/item/itemSmall.html'
  }

  return {
    restrict: 'AE',
    replace: true,
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

      $scope.$watch('item', newItem => {
        ctrl.item = newItem
        ItemAux.extendForDisplay(ctrl.item)
        ctrl.item.postTypeCode = PostUtils.getPostTypeCode(newItem.author._type, newItem.type, newItem.exact_type)
      })

    }],
    link: function (scope, el, attrs) {}
  }

}])