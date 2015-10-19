 'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.conversationAdd
 * @description
 * @restrict A
 */
angular.module('hearth.directives').directive('navigation', [
    '$rootScope', 'Auth', '$state',
    function($rootScope, Auth, $state) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            templateUrl: 'templates/directives/navigation.html',
            link: function($scope, element) {
                $scope.searchHidden = true;
                $scope.searchHidden = false;
                $scope.searchFilterDisplayed = false;
                
                $scope.toggleSearchFilter = function() {

                    $scope.searchFilterDisplayed = !$scope.searchFilterDisplayed;
                };

                $scope.selectSearchFilter = function(filter) {
                    $scope.searchFilterDisplayed = false;
                    $scope.searchQuery.type = filter;
                };
            }

        };
    }
]);
