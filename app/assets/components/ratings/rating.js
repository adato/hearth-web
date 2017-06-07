'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.rating
 * @description rating item
 * @restrict AE
 */
angular.module('hearth.directives').directive('rating', function () {

  return {
    restrict: 'AE',
    scope: {
      item: '='
    },
    templateUrl: 'assets/components/ratings/rating.html',
    controllerAs: 'vm',
    controller: ['$scope', '$rootScope', function($scope, $rootScope) {
      const vm = this
      vm.item = $scope.item
      vm.getProfileLink= $rootScope.getProfileLink
    }]
  }

})
