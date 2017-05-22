'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.heart
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('heart', [function() {

	return {
		restrict: 'AE',
    scope: {
      item: '='
    },
    controller: ['$scope', 'ItemAux', '$rootScope', function($scope, ItemAux, $rootScope) {
      $scope.loggedUser = $rootScope.loggedUser;
      $scope.ItemAux = ItemAux;
    }],
    templateUrl: 'assets/components/item/heart.html'
  };

}]);