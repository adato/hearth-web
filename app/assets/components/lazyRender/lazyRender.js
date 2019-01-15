'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.loading
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('lazyRender', function () {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            const observer = new IntersectionObserver((changes) => {
                changes.forEach((change) => {
                    if(change.intersectionRatio > 0){
                        change.target.src = change.target.getAttribute('data-src');
                    }
                });
            });
            const img = angular.element(element)[0];
            observer.observe(img);

        }
    }
});