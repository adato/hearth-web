'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.flexslider
 * @description Add flexslider to page
 * @restrict A
 */
angular.module('hearth.directives').directive('flexslider', function() {

    return {
        link: function($scope, element, attrs) {

            setTimeout(function() {

                element.flexslider({
                    animation: "slide",
                    itemWidth: 600,
                    itemMargin: 50,
                    useCSS: false,
                    directionNav: false,
                    // after: $scope.hideItem,
                    slideshow: false
                });
            });

            $scope.hideItem = function(slider) {
                console.log(slider.currentSlide);
            }
        }
    }
});