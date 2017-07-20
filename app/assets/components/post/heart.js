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
    controller: ['$scope', 'PostAux', '$rootScope', function($scope, PostAux, $rootScope) {
      $scope.loggedUser = $rootScope.loggedUser
      $scope.PostAux = PostAux
    }],
    templateUrl: 'assets/components/post/heart.html'
  }

}])