'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.postSmall
 * @description small item bow with settable template
 * @restrict AE
 */
angular.module('hearth.directives').directive('postSmall', ['$rootScope', function ($rootScope) {

  const templates = {
    condensed: 'assets/components/post/postCondensed.html',
    default: 'assets/components/post/postSmall.html'
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
    controller: ['$scope', '$window', 'PostAux', 'Rights', function($scope, $window, PostAux, Rights) {

      const ctrl = this

      ctrl.item = $scope.item
      extend(ctrl.item)

      ctrl.postTypes = $window.$$config.postTypes
      ctrl.isPostActive = PostAux.isPostActive
      ctrl.userHasRight = Rights.userHasRight
      ctrl.logPostTextToggle = PostAux.logPostTextToggle
      ctrl.getProfileLink = $rootScope.getProfileLink

      // temp workaround for links leading to posts that will not be shown
      ctrl.onlyAllowActive = (item, event) => {
        if (PostAux.isPostActive(item)) return
        event.preventDefault()
        PostAux.postInaccessibleModal()
      }

      $scope.$watch('ctrl.item', extend)

      function extend(item) {
        if (!item) return
        ctrl.item = item
        PostAux.extendForDisplay(item)
        item.postTypeCode = PostAux.getPostTypeCode(item.author._type, item.type, item.exact_type)
      }

    }]
  }

}])