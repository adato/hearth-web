'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.tipsy
 * @description Cool tool for tool tips
 * @restrict A
 */
angular.module('hearth.directives').directive('tipsy', [
    '$timeout',
    function($timeout) {
        return {
            scope: {
                tipsyHide: "=",
            },
            link: function($scope, element, attrs) {
                $timeout(function() {
                    if(!$scope.tipsyHide)
                        $(element).tipsy({gravity: 's'});
                });
            }
        }
    }
]);
