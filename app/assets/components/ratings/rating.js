'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.rating
 * @description rating item
 * @restrict AE
 */
angular.module('hearth.directives').directive('rating', [function() {

  return {
    restrict: 'AE',
    scope: {
      item: '='
    },
    templateUrl: 'assets/components/ratings/rating.html',
    bindToController: true,
    controllerAs: 'vm',

    controller: ['$rootScope', '$scope', function($rootScope, $scope) {
      var vm = this
      vm.getProfileLink= $rootScope.getProfileLink
      vm.postTypes = $$config.postTypes
      vm.item = $scope.item
    }]
  }

}])
