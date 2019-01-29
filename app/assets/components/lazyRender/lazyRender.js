'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.lazyRender
 * @description Uses IntersectionObserver to detect if images are out-of-view in browser window
 *              and load them after they become near viewport
 * @restrict E
 */

angular.module('hearth.directives').directive('lazyRender', ['$window', '$timeout', ($window, $timeout) => {
    return {
        restrict: 'A',
        link: (scope, element, attrs) => {
            if ('IntersectionObserver' in $window) {
                const observer = new IntersectionObserver((changes) => {
                    changes.forEach((change) => {
                        if (change.intersectionRatio > 0){
                            change.target.src = change.target.getAttribute('data-src');
                        }
                    });
                });
                const img = angular.element(element)[0];
                observer.observe(img);
            } else {
                $timeout(() => {
                    let img = angular.element(element)[0];
                    img.src = img.getAttribute('data-src');
                });
            }

        }
    }
}]);