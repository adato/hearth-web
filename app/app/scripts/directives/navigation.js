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
            templateUrl: 'templates/navigation.html',
            link: function($scope, element) {
              console.log($scope);
            }

        };
    }
]);
